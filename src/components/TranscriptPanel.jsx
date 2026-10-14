import React from 'react';
import { Mic, CheckCircle2 } from 'lucide-react';

export default function TranscriptPanel({
  liveTranscript = '',
  isListening = false,
  detectedCountLastPhrase = 0,
  selectedMantraName = 'Rama'
}) {
  if (!isListening && !liveTranscript) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto my-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 backdrop-blur-sm shadow-sm transition-all">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-saffron-500 animate-ping"></span>
          Live Speech Transcript
        </span>

        {detectedCountLastPhrase > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-saffron-500 text-white animate-bounce">
            <CheckCircle2 className="w-3 h-3" />
            +{detectedCountLastPhrase} Count{detectedCountLastPhrase > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="min-h-[38px] flex items-center justify-center text-center px-2 py-1 bg-white/70 dark:bg-stone-950/60 rounded-xl border border-amber-100 dark:border-stone-800/80">
        {liveTranscript ? (
          <p className="font-sans text-sm font-medium text-stone-800 dark:text-stone-200 italic">
            "{liveTranscript}"
          </p>
        ) : (
          <p className="text-xs text-stone-400 dark:text-stone-500 italic">
            Chant softly into microphone... (listening)
          </p>
        )}
      </div>
    </div>
  );
}
