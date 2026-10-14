import React, { useState } from 'react';
import CountDisplay from '../components/CountDisplay';
import CountButton from '../components/CountButton';
import MalaBeads from '../components/MalaBeads';
import VoiceControls from '../components/VoiceControls';
import TranscriptPanel from '../components/TranscriptPanel';
import GoalProgress from '../components/GoalProgress';
import MantraSelector from '../components/MantraSelector';
import ResetDialog from '../components/ResetDialog';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MANTRAS } from '../utils/mantraConfig';
import { RotateCcw, CheckCircle, Save } from 'lucide-react';

export default function Home({ japaState }) {
  const {
    activeSession,
    sessionCount,
    completedMalas,
    currentMalaProgress,
    lifetimeTotal,
    todayTotal,
    dailyGoal,
    goalProgressPercent,
    chantsRemainingForGoal,
    justCompletedGoal,
    beadIncrementKey,
    settings,
    incrementManual,
    incrementVoice,
    setMantra,
    endCurrentSession,
    resetCurrentSession,
    clearAllHistory,
    resetAllApplicationData
  } = japaState;

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [sessionSavedNotice, setSessionSavedNotice] = useState(false);

  const selectedMantra = MANTRAS.find(m => m.id === activeSession?.mantraId) || MANTRAS[0];

  // Speech recognition hook
  const {
    isListening,
    isSupported,
    liveTranscript,
    errorMessage,
    detectedCountLastPhrase,
    startListening,
    stopListening,
    clearError
  } = useSpeechRecognition({
    mantraId: selectedMantra.id,
    language: settings.speechLanguage || selectedMantra.defaultLang || 'hi-IN',
    onMantraCountsFound: (countDelta, transcript) => {
      incrementVoice(countDelta, transcript);
    }
  });

  const handleEndSession = () => {
    if (sessionCount > 0) {
      if (isListening) stopListening();
      endCurrentSession();
      setSessionSavedNotice(true);
      setTimeout(() => setSessionSavedNotice(false), 3500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-24 px-4 pt-1 max-w-lg mx-auto">
      {/* Session Saved Notification Banner */}
      {sessionSavedNotice && (
        <div className="w-full mb-2 p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Session saved to History. Fresh session active.</span>
        </div>
      )}

      {/* Mantra Dropdown Selector */}
      <MantraSelector
        selectedMantraId={selectedMantra.id}
        onSelectMantra={setMantra}
        disabled={isListening}
      />

      {/* Visual 108 Beads Mala encircling the Count Display */}
      <MalaBeads
        currentMalaProgress={currentMalaProgress}
        completedMalas={completedMalas}
        beadIncrementKey={beadIncrementKey}
      >
        <CountDisplay
          count={sessionCount}
          mantraId={selectedMantra.id}
          completedMalas={completedMalas}
          currentMalaProgress={currentMalaProgress}
          lifetimeTotal={lifetimeTotal}
          todayTotal={todayTotal}
          dailyGoal={dailyGoal}
          beadIncrementKey={beadIncrementKey}
        />
      </MalaBeads>

      {/* Aggregate Statistics Pills */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs px-2 my-2">
        <div className="flex flex-col items-center justify-center py-1 px-2 rounded-xl bg-amber-50/70 dark:bg-stone-900/70 border border-amber-200/50 dark:border-stone-800">
          <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">Malas</span>
          <span className="text-sm font-bold text-saffron-600 dark:text-saffron-400">
            {completedMalas}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-1 px-2 rounded-xl bg-amber-50/70 dark:bg-stone-900/70 border border-amber-200/50 dark:border-stone-800">
          <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">Today</span>
          <span className="text-sm font-bold text-amber-700 dark:text-gold-400">
            {todayTotal.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-1 px-2 rounded-xl bg-amber-50/70 dark:bg-stone-900/70 border border-amber-200/50 dark:border-stone-800">
          <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">Lifetime</span>
          <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
            {lifetimeTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Big Manual Count Button */}
      <CountButton
        onIncrement={incrementManual}
      />

      {/* Voice Recognition Section */}
      <div className="w-full my-1">
        <VoiceControls
          isListening={isListening}
          isSupported={isSupported}
          errorMessage={errorMessage}
          onStartListening={startListening}
          onStopListening={stopListening}
          onClearError={clearError}
          selectedMantraName={selectedMantra.name}
        />

        <TranscriptPanel
          liveTranscript={liveTranscript}
          isListening={isListening}
          detectedCountLastPhrase={detectedCountLastPhrase}
          selectedMantraName={selectedMantra.name}
        />
      </div>

      {/* Daily Goal Card */}
      <div className="w-full my-2">
        <GoalProgress
          todayTotal={todayTotal}
          dailyGoal={dailyGoal}
          goalProgressPercent={goalProgressPercent}
          chantsRemaining={chantsRemainingForGoal}
          justCompletedGoal={justCompletedGoal}
        />
      </div>

      {/* Action Row: Save Session & Reset */}
      <div className="w-full max-w-sm flex items-center justify-between gap-3 mt-3 pt-3 border-t border-amber-200/50 dark:border-stone-800">
        <button
          type="button"
          onClick={handleEndSession}
          disabled={sessionCount === 0}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shadow-sm ${
            sessionCount > 0
              ? 'bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-brown-900 dark:text-cream-100 border border-amber-300 dark:border-stone-700 active:scale-95'
              : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border border-stone-200 dark:border-stone-800 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
          <span>Save & End Session</span>
        </button>

        <button
          type="button"
          onClick={() => setIsResetOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>Reset...</span>
        </button>
      </div>

      {/* Safe Reset Confirmation Modal */}
      <ResetDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onResetSession={resetCurrentSession}
        onClearHistory={clearAllHistory}
        onResetAllData={resetAllApplicationData}
      />
    </div>
  );
}
