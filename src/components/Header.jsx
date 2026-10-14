import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Wifi, WifiOff } from 'lucide-react';

export default function Header({
  soundEnabled = true,
  onToggleSound = () => {},
  currentMantra = null,
  activeTab = 'home',
  onNavigate = () => {}
}) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-cream-100/90 dark:bg-stone-950/90 border-b border-amber-200/40 dark:border-amber-900/40 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Sacred Icon */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-saffron-500 to-gold-400 flex items-center justify-center shadow-sm shadow-saffron-500/20 group-hover:scale-105 transition-transform">
            <span className="font-devanagari font-bold text-lg text-cream-100 leading-none">ॐ</span>
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg tracking-tight text-brown-900 dark:text-cream-100 flex items-center gap-1.5">
              Japa Counter
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-saffron-100 dark:bg-saffron-950/80 text-saffron-700 dark:text-saffron-300 border border-saffron-300/40 dark:border-saffron-800/40">
                Offline
              </span>
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              Sacred Chanting Companion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Online / Offline Status Badge */}
          <div 
            title={isOnline ? 'Online (Voice speech recognition ready)' : 'Offline mode (Chanting and history active)'}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border transition-colors ${
              isOnline 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40' 
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40'
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span className="hidden sm:inline">{isOnline ? 'Ready' : 'Offline'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sacred bell' : 'Unmute sacred bell'}
            className={`p-2 rounded-xl transition-all duration-150 border ${
              soundEnabled
                ? 'bg-amber-100/70 dark:bg-stone-800/80 text-saffron-600 dark:text-gold-400 border-amber-300/60 dark:border-stone-700 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
