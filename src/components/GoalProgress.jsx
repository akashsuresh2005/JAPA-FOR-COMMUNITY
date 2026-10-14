import React from 'react';
import { Target, CheckCircle, Sparkles } from 'lucide-react';

export default function GoalProgress({
  todayTotal = 0,
  dailyGoal = 108,
  goalProgressPercent = 0,
  chantsRemaining = 0,
  justCompletedGoal = false
}) {
  const isGoalReached = todayTotal >= dailyGoal;

  return (
    <div className={`w-full max-w-md mx-auto p-3.5 rounded-2xl transition-all duration-300 border ${
      isGoalReached
        ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-gold-400/60 dark:border-gold-500/40 shadow-sm'
        : 'bg-cream-50/60 dark:bg-stone-900/40 border-amber-200/40 dark:border-stone-800'
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
          <Target className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
          <span>Daily Goal</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          {isGoalReached ? (
            <span className="flex items-center gap-1 font-bold text-amber-700 dark:text-gold-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Completed! ({todayTotal}/{dailyGoal})
            </span>
          ) : (
            <span className="font-medium text-stone-500 dark:text-stone-400">
              <strong className="text-stone-800 dark:text-stone-200 font-bold">{todayTotal}</strong> / {dailyGoal} chants
            </span>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isGoalReached
              ? 'bg-gradient-to-r from-gold-400 via-saffron-500 to-gold-300'
              : 'bg-gradient-to-r from-saffron-500 to-gold-400'
          }`}
          style={{ width: `${Math.min(100, goalProgressPercent)}%` }}
        />
      </div>

      {/* Footer Text */}
      <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500 dark:text-stone-400">
        <span>{goalProgressPercent}% of target</span>
        <span>
          {isGoalReached
            ? 'Blessings and peace 🌸'
            : `${chantsRemaining} chants remaining`}
        </span>
      </div>

      {/* Celebration Banner when newly reached */}
      {justCompletedGoal && (
        <div className="mt-2 pt-2 border-t border-gold-300/40 text-center animate-bounce text-xs font-bold text-saffron-700 dark:text-gold-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hari Om! You reached today's chanting goal!</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
