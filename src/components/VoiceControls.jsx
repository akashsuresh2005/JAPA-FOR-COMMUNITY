import React from 'react';
import { Mic, MicOff, AlertCircle, Info, Sparkles, Volume2 } from 'lucide-react';

export default function VoiceControls({
  isListening = false,
  isSupported = true,
  errorMessage = null,
  onStartListening = () => {},
  onStopListening = () => {},
  onClearError = () => {},
  selectedMantraName = 'Rama'
}) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3">
      {/* Voice Toggle Button */}
      <div className="flex items-center gap-2">
        {isListening ? (
          <button
            type="button"
            id="voice-stop-btn"
            onClick={onStopListening}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm shadow-md transition-all duration-150 active:scale-95"
          >
            {/* Pulsing Red Recording Indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <MicOff className="w-4 h-4" />
            <span>Stop Listening</span>
          </button>
        ) : (
          <button
            type="button"
            id="voice-start-btn"
            onClick={onStartListening}
            disabled={!isSupported}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-150 active:scale-95 shadow-sm ${
              isSupported
                ? 'bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-brown-900 dark:text-cream-100 border border-amber-300 dark:border-stone-700'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border border-stone-200 dark:border-stone-800 cursor-not-allowed'
            }`}
          >
            <Mic className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
            <span>Voice Chanting</span>
          </button>
        )}
      </div>

      {/* Error / Notice Banner */}
      {errorMessage && (
        <div className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 leading-relaxed">
            <p className="font-semibold">Speech Recognition Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Listening Active Hint */}
      {isListening && (
        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium text-center flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
          <span>Speak clearly into your microphone: "{selectedMantraName}"</span>
        </p>
      )}
    </div>
  );
}
