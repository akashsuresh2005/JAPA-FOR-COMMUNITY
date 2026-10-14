import React from 'react';
import { MANTRAS } from '../utils/mantraConfig';

export default function CountDisplay({
  count = 0,
  mantraId = 'rama',
  completedMalas = 0,
  currentMalaProgress = 0,
  lifetimeTotal = 0,
  todayTotal = 0,
  dailyGoal = 108,
  beadIncrementKey = 0
}) {
  const mantra = MANTRAS.find(m => m.id === mantraId) || MANTRAS[0];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none py-1">
      {/* Selected Mantra Devanagari */}
      <div className="leading-tight px-1 max-w-full">
        <h2 className="font-devanagari text-xl sm:text-2xl font-bold tracking-wide text-saffron-600 dark:text-saffron-400 drop-shadow-sm truncate">
          {mantra.sanskrit}
        </h2>
        <p className="font-sans text-[11px] font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 truncate">
          {mantra.name}
        </p>
      </div>

      {/* Main Session Count Typography */}
      <div 
        key={`count-num-${beadIncrementKey}`}
        className="font-sans font-extrabold text-5xl sm:text-6xl tracking-tight text-brown-900 dark:text-cream-100 my-0.5 transition-transform duration-100 animate-tap-pop leading-none"
      >
        {count.toLocaleString()}
      </div>

      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">
        Session Chants
      </span>
    </div>
  );
}
