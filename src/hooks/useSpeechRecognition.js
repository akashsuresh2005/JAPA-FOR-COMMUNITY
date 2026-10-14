import { useState, useEffect, useRef, useCallback } from 'react';
import { countMantraOccurrences } from '../utils/mantraConfig';

/**
 * Robust Speech Recognition Hook using the Web Speech API
 * - Strictly processes ONLY finalized results
 * - Processes each finalized result once
 * - Supports repeated words like "Rama Rama Rama" => 3
 * - Resilient restart handling without double-counting
 * - Clear error states (permissions, unsupported, network, timeout)
 */
export function useSpeechRecognition({
  mantraId = 'rama',
  language = 'hi-IN',
  onMantraCountsFound = () => {},
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [detectedCountLastPhrase, setDetectedCountLastPhrase] = useState(0);

  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const lastProcessedIndexRef = useRef(-1);
  const restartTimerRef = useRef(null);

  // Keep latest callbacks and parameters in refs to avoid stale closures in event handlers
  const onMantraCountsFoundRef = useRef(onMantraCountsFound);
  onMantraCountsFoundRef.current = onMantraCountsFound;

  const mantraIdRef = useRef(mantraId);
  mantraIdRef.current = mantraId;

  const languageRef = useRef(language);
  languageRef.current = language;

  // Initialize and verify browser support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup helper
  const teardownRecognition = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (err) {
        // Safe ignore
      }
      recognitionRef.current = null;
    }
    lastProcessedIndexRef.current = -1;
  }, []);

  const createAndStartRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage('Speech recognition is not supported in this browser. Please use manual counting or Google Chrome / Microsoft Edge.');
      return;
    }

    teardownRecognition();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = languageRef.current || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event) => {
        let interimText = '';
        let finalizedFound = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || '';

          if (result.isFinal) {
            // Process this finalized result index ONLY ONCE
            if (i > lastProcessedIndexRef.current) {
              lastProcessedIndexRef.current = i;
              finalizedFound = true;
              setLiveTranscript(transcript);

              // Calculate count for this finalized piece of speech
              const countDelta = countMantraOccurrences(transcript, mantraIdRef.current);
              setDetectedCountLastPhrase(countDelta);

              if (countDelta > 0 && onMantraCountsFoundRef.current) {
                onMantraCountsFoundRef.current(countDelta, transcript);
              }
            }
          } else {
            // Interim transcript: Visual feedback ONLY. NEVER counts.
            interimText += transcript;
          }
        }

        if (!finalizedFound && interimText) {
          setLiveTranscript(interimText);
        }
      };

      recognition.onerror = (event) => {
        const error = event.error;
        console.warn('Speech recognition error:', error);

        if (error === 'no-speech') {
          // Normal silence, keep listening if desired
          return;
        }

        if (error === 'not-allowed' || error === 'service-not-allowed') {
          shouldListenRef.current = false;
          setIsListening(false);
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser settings to chant with voice.');
        } else if (error === 'network') {
          setErrorMessage('Speech recognition requires an internet connection on this browser. Manual counting works 100% offline.');
        } else if (error === 'audio-capture') {
          shouldListenRef.current = false;
          setIsListening(false);
          setErrorMessage('No microphone was detected. Please check your audio input device.');
        } else {
          setErrorMessage(`Speech recognition notice: ${error}`);
        }
      };

      recognition.onend = () => {
        // When speech recognition ends automatically (silence/limit):
        // If the user hasn't explicitly stopped, restart seamlessly.
        if (shouldListenRef.current) {
          lastProcessedIndexRef.current = -1; // Reset index for new recognition instance
          restartTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current) {
              try {
                recognition.start();
              } catch (e) {
                // If restarting existing instance fails, re-create
                createAndStartRecognition();
              }
            }
          }, 200);
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setErrorMessage('Could not initiate microphone. Please verify device permissions.');
    }
  }, [teardownRecognition]);

  // Start listening handler
  const startListening = useCallback(() => {
    setErrorMessage(null);
    setLiveTranscript('');
    setDetectedCountLastPhrase(0);
    shouldListenRef.current = true;
    createAndStartRecognition();
  }, [createAndStartRecognition]);

  // Stop listening handler
  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    setIsListening(false);
    teardownRecognition();
  }, [teardownRecognition]);

  // If language changes while actively listening, restart with new language
  useEffect(() => {
    if (shouldListenRef.current && isListening) {
      stopListening();
      startListening();
    }
  }, [language]);

  // Teardown on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      teardownRecognition();
    };
  }, [teardownRecognition]);

  return {
    isListening,
    isSupported,
    liveTranscript,
    errorMessage,
    detectedCountLastPhrase,
    startListening,
    stopListening,
    clearError: () => setErrorMessage(null),
  };
}
