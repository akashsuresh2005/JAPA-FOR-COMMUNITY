import React from 'react';
import { MANTRAS } from '../utils/mantraConfig';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function MantraSelector({
  selectedMantraId = 'rama',
  onSelectMantra = () => {},
  disabled = false
}) {
  return (
    <div className="w-full max-w-sm mx-auto my-2">
      <label htmlFor="mantra-select" className="sr-only">
        Select Chanting Mantra
      </label>
      <div className="relative">
        <select
          id="mantra-select"
          disabled={disabled}
          value={selectedMantraId}
          onChange={(e) => onSelectMantra(e.target.value)}
          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/80 dark:border-stone-700/80 text-brown-900 dark:text-cream-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-sm cursor-pointer transition-all"
        >
          {MANTRAS.map((m) => (
            <option key={m.id} value={m.id} className="bg-cream-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 py-1">
              {m.name} — {m.sanskrit}
            </option>
          ))}
        </select>

        {/* Dropdown chevron */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-saffron-600 dark:text-saffron-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
