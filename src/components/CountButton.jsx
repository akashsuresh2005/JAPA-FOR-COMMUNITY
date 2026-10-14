import React, { useState } from 'react';

/**
 * Large, comfortable, tactile counting button.
 * Prevents double-taps, supports keyboard (Space/Enter), and provides visual & haptic response.
 */
export default function CountButton({
  onIncrement = () => {},
  disabled = false
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = () => {
    setIsPressed(true);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled) {
      onIncrement();
    }
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsPressed(true);
      if (!disabled) {
        onIncrement();
      }
    }
  };

  const handleKeyUp = (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
      setIsPressed(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-4 select-none">
      <button
        type="button"
        id="manual-chant-btn"
        aria-label="Increment chant count by one"
        disabled={disabled}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        style={{ touchAction: 'manipulation' }}
        className={`relative group w-44 h-44 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-100 outline-none focus-visible:ring-4 focus-visible:ring-saffron-400 focus-visible:ring-offset-2 ${
          isPressed ? 'scale-95 shadow-inner' : 'hover:scale-[1.02] shadow-xl'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Outer Radiant Glow Rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-saffron-500/20 via-gold-400/20 to-transparent -m-3 blur-md group-hover:scale-105 transition-transform"></div>
        <div className="absolute inset-0 rounded-full border-2 border-saffron-400/30 dark:border-saffron-500/30 -m-1.5 animate-pulse-subtle"></div>

        {/* Outer Ring Bezel */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gold-300 via-saffron-500 to-amber-700 p-1 shadow-md">
          {/* Inner Button Disc */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-saffron-600 via-saffron-500 to-gold-500 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner">
            {/* Soft Ambient Light reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-full pointer-events-none"></div>

            {/* Sacred Om Symbol Icon */}
            <span className="font-devanagari text-4xl sm:text-5xl font-bold leading-none text-cream-50 drop-shadow-md">
              ॐ
            </span>

            {/* Tap instruction */}
            <span className="font-sans text-xs sm:text-[13px] font-bold uppercase tracking-wider text-amber-100/90 mt-1 drop-shadow-sm">
              Tap to Chant
            </span>

            {/* Count Increment Prompt */}
            <span className="text-[10px] font-semibold text-cream-100/70 tracking-widest mt-0.5">
              +1
            </span>
          </div>
        </div>
      </button>

      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-2 flex items-center gap-1.5">
        <span>Tap button or press</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded border border-stone-300 dark:border-stone-700">
          Space
        </kbd>
      </p>
    </div>
  );
}
