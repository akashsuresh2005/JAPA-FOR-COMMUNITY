import React, { useMemo } from 'react';

/**
 * Visual Mala displaying exactly 108 circular chanting beads in an SVG ring.
 * Encircles the sacred count and mantra in the center.
 */
export default function MalaBeads({
  currentMalaProgress = 0,
  completedMalas = 0,
  beadIncrementKey = 0,
  children
}) {
  const TOTAL_BEADS = 108;
  const viewBoxSize = 340;
  const center = viewBoxSize / 2;
  const radius = 142;
  const beadRadius = 2.65;

  // Compute 108 bead positions along the circle
  const beads = useMemo(() => {
    const coords = [];
    for (let i = 0; i < TOTAL_BEADS; i++) {
      // Start clockwise from the top right after the Sumeru bead
      const angle = -Math.PI / 2 + (2 * Math.PI * (i + 0.5)) / TOTAL_BEADS;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      coords.push({ index: i, x, y });
    }
    return coords;
  }, [center, radius]);

  // Current active bead position
  const activeBeadIndex = currentMalaProgress > 0 ? currentMalaProgress - 1 : -1;
  const activeBead = activeBeadIndex >= 0 ? beads[activeBeadIndex] : null;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[290px] sm:max-w-[320px] mx-auto my-1">
      <div className="relative w-full aspect-square flex items-center justify-center">
        {/* SVG Ring of 108 Beads */}
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="absolute inset-0 w-full h-full transform transition-all duration-300 pointer-events-none"
          aria-label={`Visual Japa Mala showing ${currentMalaProgress} of 108 beads`}
        >
          <defs>
            <radialGradient id="completedBeadGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="60%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#C2410C" />
            </radialGradient>
            <radialGradient id="sumeruGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF8E7" />
              <stop offset="40%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
            <filter id="beadGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtle Background Guide Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className="stroke-amber-900/10 dark:stroke-amber-100/10"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* 108 Chanting Beads */}
          {beads.map((bead) => {
            const isCompleted = bead.index < currentMalaProgress;
            const isLatest = bead.index === activeBeadIndex;

            return (
              <circle
                key={bead.index}
                cx={bead.x}
                cy={bead.y}
                r={isLatest ? beadRadius * 1.4 : beadRadius}
                fill={isCompleted ? 'url(#completedBeadGrad)' : 'currentColor'}
                className={`transition-colors duration-200 ${
                  isCompleted
                    ? 'stroke-amber-300/60 dark:stroke-amber-400/50'
                    : 'text-stone-300/80 dark:text-stone-700/80 stroke-stone-400/40 dark:stroke-stone-600/40'
                }`}
                strokeWidth={isLatest ? 1.5 : 0.6}
              />
            );
          })}

          {/* Radiant Halo around the latest chanted bead */}
          {activeBead && (
            <circle
              key={`halo-${beadIncrementKey}`}
              cx={activeBead.x}
              cy={activeBead.y}
              r={beadRadius * 2.2}
              fill="none"
              stroke="#FFD700"
              strokeWidth="1.5"
              className="animate-ping opacity-75"
            />
          )}

          {/* Traditional Sumeru (Guru) Bead at the apex (Top center) */}
          <g transform={`translate(${center}, ${center - radius})`}>
            {/* Guru Bead Jewel */}
            <circle
              cx="0"
              cy="0"
              r="6.5"
              fill="url(#sumeruGrad)"
              stroke="#9A3412"
              strokeWidth="1"
              filter="url(#beadGlow)"
            />
            {/* Tassel / Crown Accent */}
            <path
              d="M -3 -7 L 0 -13 L 3 -7 Z"
              fill="#FF6B00"
              className="drop-shadow-sm"
            />
          </g>
        </svg>

        {/* Center Content Slot (Count & Mantra) */}
        <div className="relative z-10 w-[74%] h-[74%] rounded-full flex flex-col items-center justify-center p-2 text-center pointer-events-auto">
          {children}
        </div>
      </div>

      {/* Completed Malas Counter Badge */}
      <div className="mt-1 flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-stone-900 border border-amber-200/60 dark:border-amber-900/40 text-xs font-medium text-amber-900 dark:text-amber-200 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-saffron-500 to-gold-400 animate-pulse"></span>
        <span>
          <strong className="font-bold text-saffron-600 dark:text-gold-400">{completedMalas}</strong> {completedMalas === 1 ? 'Mala' : 'Malas'} Completed
        </span>
        <span className="text-stone-400 dark:text-stone-600">•</span>
        <span className="text-stone-600 dark:text-stone-300 font-semibold">
          {currentMalaProgress}/108
        </span>
      </div>
    </div>
  );
}
