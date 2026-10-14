import React, { useState, useRef } from 'react';
import { MANTRAS } from '../utils/mantraConfig';
import {
  Settings as SettingsIcon,
  Bell,
  Mic,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  ShieldAlert,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';

export default function Settings({ japaState }) {
  const {
    settings,
    updateSettings,
    clearAllHistory,
    resetAllApplicationData,
    exportData,
    importData
  } = japaState;

  const [customGoalInput, setCustomGoalInput] = useState(
    settings.dailyGoal !== 108 && settings.dailyGoal !== 1008
      ? String(settings.dailyGoal)
      : String(settings.customGoal || 108)
  );
  const [importStatus, setImportStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const fileInputRef = useRef(null);

  // Daily Goal handler
  const handleSelectGoal = (goalValue) => {
    if (goalValue === 'custom') {
      const parsed = parseInt(customGoalInput, 10);
      if (parsed > 0) {
        updateSettings({ dailyGoal: parsed, customGoal: parsed });
      }
    } else {
      updateSettings({ dailyGoal: goalValue });
    }
  };

  const handleCustomGoalSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(customGoalInput, 10);
    if (Number.isInteger(parsed) && parsed > 0) {
      updateSettings({ dailyGoal: parsed, customGoal: parsed });
      setImportStatus({ type: 'success', message: `Daily goal set to ${parsed} chants.` });
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus({ type: 'error', message: 'Please enter a valid positive whole number.' });
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  // Export JSON handler
  const handleExportJson = () => {
    try {
      const jsonStr = exportData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `japa-counter-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setImportStatus({ type: 'success', message: 'Backup JSON exported successfully.' });
      setTimeout(() => setImportStatus(null), 3500);
    } catch (err) {
      setImportStatus({ type: 'error', message: 'Failed to export backup data.' });
    }
  };

  // Import JSON handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        importData(text);
        setImportStatus({ type: 'success', message: 'Data imported successfully!' });
        setTimeout(() => setImportStatus(null), 4000);
      } catch (err) {
        setImportStatus({ type: 'error', message: err.message || 'Invalid backup file.' });
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Error reading file.' });
    };
    reader.readAsText(file);
    // Reset file input so user can import the same file again if desired
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-28 px-4 pt-3 select-none">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold font-sans text-brown-900 dark:text-cream-100 flex items-center gap-2">
          <span>Settings</span>
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Preferences, audio milestones, devotional theme, and data backups
        </p>
      </div>

      {/* Notice Alert */}
      {importStatus && (
        <div className={`p-3 rounded-2xl mb-4 text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
          importStatus.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            : 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-200 border border-red-300 dark:border-red-800'
        }`}>
          {importStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{importStatus.message}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Section 1: Daily Chanting Goal */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 shadow-sm">
          <label className="block text-sm font-bold text-brown-900 dark:text-cream-100 mb-1">
            Daily Chanting Goal
          </label>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Choose your daily spiritual chant commitment.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              type="button"
              onClick={() => handleSelectGoal(108)}
              className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all border ${
                settings.dailyGoal === 108
                  ? 'bg-saffron-500 text-white border-saffron-600 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-300'
              }`}
            >
              108 (1 Mala)
            </button>

            <button
              type="button"
              onClick={() => handleSelectGoal(1008)}
              className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all border ${
                settings.dailyGoal === 1008
                  ? 'bg-saffron-500 text-white border-saffron-600 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-300'
              }`}
            >
              1008 Chants
            </button>

            <button
              type="button"
              onClick={() => handleSelectGoal('custom')}
              className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all border ${
                settings.dailyGoal !== 108 && settings.dailyGoal !== 1008
                  ? 'bg-saffron-500 text-white border-saffron-600 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-300'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom goal input */}
          <form onSubmit={handleCustomGoalSubmit} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 540"
              value={customGoalInput}
              onChange={(e) => setCustomGoalInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-cream-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 text-sm font-medium text-brown-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-brown-900 dark:text-cream-100 font-semibold text-xs border border-amber-300 dark:border-stone-700 transition-colors"
            >
              Set Goal
            </button>
          </form>
        </div>

        {/* Section 2: Default Mantra */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 shadow-sm">
          <label htmlFor="default-mantra-select" className="block text-sm font-bold text-brown-900 dark:text-cream-100 mb-1">
            Default Chanting Mantra
          </label>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            The mantra selected automatically when opening the app.
          </p>

          <select
            id="default-mantra-select"
            value={settings.defaultMantra}
            onChange={(e) => updateSettings({ defaultMantra: e.target.value })}
            className="w-full px-3 py-2.5 rounded-2xl bg-cream-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 text-sm font-medium text-brown-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-saffron-500 cursor-pointer"
          >
            {MANTRAS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.sanskrit}
              </option>
            ))}
          </select>
        </div>

        {/* Section 3: Audio & Bell Settings */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brown-900 dark:text-cream-100 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
                Mala Completion Bell Sound
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Play temple singing bowl chime at every 108th bead milestone.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron-500"></div>
            </label>
          </div>
        </div>

        {/* Section 4: Voice Speech Language */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 shadow-sm">
          <label htmlFor="voice-lang-select" className="block text-sm font-bold text-brown-900 dark:text-cream-100 mb-1 flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
            Voice Recognition Language
          </label>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Primary language model used by browser speech recognition.
          </p>

          <select
            id="voice-lang-select"
            value={settings.speechLanguage || 'hi-IN'}
            onChange={(e) => updateSettings({ speechLanguage: e.target.value })}
            className="w-full px-3 py-2.5 rounded-2xl bg-cream-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 text-sm font-medium text-brown-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-saffron-500 cursor-pointer"
          >
            <option value="hi-IN">Hindi / Sanskrit (India) — hi-IN</option>
            <option value="en-IN">English (India) — en-IN</option>
            <option value="en-US">English (US) — en-US</option>
            <option value="sa">Sanskrit (where supported) — sa</option>
          </select>
        </div>

        {/* Section 5: Theme Selection */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 shadow-sm">
          <p className="text-sm font-bold text-brown-900 dark:text-cream-100 mb-1">
            Display Theme
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Traditional warm devotional palette or deep dark mode for evening chanting.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-semibold text-xs transition-all border ${
                settings.theme === 'light'
                  ? 'bg-amber-100 text-saffron-700 border-saffron-500 ring-2 ring-saffron-400/20 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Saffron & Cream (Light)</span>
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-semibold text-xs transition-all border ${
                settings.theme === 'dark'
                  ? 'bg-stone-800 text-gold-400 border-gold-500 ring-2 ring-gold-500/20 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Moon className="w-4 h-4 text-gold-400" />
              <span>Deep Sandalwood (Dark)</span>
            </button>
          </div>
        </div>

        {/* Section 6: Data Backup, Export & Import */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 shadow-sm">
          <p className="text-sm font-bold text-brown-900 dark:text-cream-100 mb-1">
            Data Backup & Restore
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Export all your history and settings to a JSON file or restore from a previous backup.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-brown-900 dark:text-cream-100 font-semibold text-xs border border-amber-300 dark:border-stone-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
              <span>Export History (JSON)</span>
            </button>

            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-xs border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer shadow-sm">
              <Upload className="w-4 h-4 text-stone-500" />
              <span>Import Backup</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 7: Offline & PWA Information */}
        <div className="p-4 rounded-3xl bg-amber-50/60 dark:bg-stone-900/40 border border-amber-200/40 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-brown-900 dark:text-cream-100 mb-1">
            <Info className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
            <span>Offline First & PWA Notice</span>
          </div>
          <p className="mt-1">
            • <strong>100% Offline Chanting:</strong> Manual counting, visual 108 mala bead tracking, sacred bell audio, settings, and session history run entirely inside your browser and local storage without internet connection.
          </p>
          <p className="mt-1">
            • <strong>Voice Recognition Note:</strong> In many mobile and desktop browsers (such as Google Chrome), the Web Speech API processes audio through cloud speech services and may require network access. Manual counting is always available unconditionally.
          </p>
        </div>
      </div>
    </div>
  );
}
