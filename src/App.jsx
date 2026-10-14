import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import History from './pages/History';
import Settings from './pages/Settings';
import { useJapaCounter } from './hooks/useJapaCounter';
import { Sparkles, History as HistoryIcon, Settings as SettingsIcon, CircleDot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history' | 'settings'
  const japaState = useJapaCounter();

  const handleToggleSound = () => {
    japaState.updateSettings({ soundEnabled: !japaState.settings.soundEnabled });
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-stone-950 text-brown-900 dark:text-cream-100 selection:bg-saffron-200 selection:text-saffron-900 transition-colors duration-200">
      {/* Top Devotional Header */}
      <Header
        soundEnabled={japaState.settings.soundEnabled}
        onToggleSound={handleToggleSound}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      {/* Desktop Secondary Navigation Bar */}
      <nav aria-label="Desktop Navigation" className="hidden sm:flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-50/70 dark:bg-stone-900/60 border-b border-amber-200/40 dark:border-stone-800">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'home'
              ? 'bg-saffron-500 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
          }`}
        >
          <span className="font-devanagari text-sm font-bold">ॐ</span>
          <span>Chant</span>
          {japaState.sessionCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/25">
              {japaState.sessionCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-saffron-500 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
          }`}
        >
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>History</span>
          {japaState.history.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {japaState.history.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-saffron-500 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        {activeTab === 'home' && <Home japaState={japaState} />}
        {activeTab === 'history' && <History japaState={japaState} />}
        {activeTab === 'settings' && <Settings japaState={japaState} />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Mobile Bottom Navigation" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg bg-cream-50/95 dark:bg-stone-950/95 border-t border-amber-200/60 dark:border-stone-800 px-6 py-2 flex items-center justify-around shadow-lg">
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home'
              ? 'text-saffron-600 dark:text-saffron-400 scale-105'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'
          }`}
        >
          <div className="relative">
            <span className="font-devanagari text-xl font-bold leading-none">ॐ</span>
            {japaState.sessionCount > 0 && (
              <span className="absolute -top-1 -right-3 w-2 h-2 rounded-full bg-saffron-500 animate-ping"></span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Chant</span>
        </button>

        {/* History Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'history'
              ? 'text-saffron-600 dark:text-saffron-400 scale-105'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'
          }`}
        >
          <HistoryIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">History</span>
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'settings'
              ? 'text-saffron-600 dark:text-saffron-400 scale-105'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Settings</span>
        </button>
      </nav>
    </div>
  );
}
