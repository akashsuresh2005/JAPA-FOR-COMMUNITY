import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, Trash2, ShieldAlert, X } from 'lucide-react';

export default function ResetDialog({
  isOpen = false,
  onClose = () => {},
  onResetSession = () => {},
  onClearHistory = () => {},
  onResetAllData = () => {}
}) {
  const [selectedAction, setSelectedAction] = useState(null); // 'session' | 'history' | 'all'

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedAction === 'session') {
      onResetSession();
    } else if (selectedAction === 'history') {
      onClearHistory();
    } else if (selectedAction === 'all') {
      onResetAllData();
    }
    setSelectedAction(null);
    onClose();
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="reset-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-cream-50 dark:bg-stone-900 rounded-3xl border border-amber-200 dark:border-stone-800 p-6 shadow-2xl relative select-none">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-stone-800 text-amber-700 dark:text-gold-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="reset-dialog-title" className="font-bold text-lg text-brown-900 dark:text-cream-100">
              Reset Options
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Please choose which data you would like to reset:
            </p>
          </div>
        </div>

        {/* Choice List */}
        <div className="space-y-2.5 my-4">
          {/* Option 1: Reset Current Session */}
          <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedAction === 'session'
              ? 'bg-amber-100/70 dark:bg-stone-800 border-saffron-500 ring-2 ring-saffron-500/20'
              : 'bg-white dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-amber-300'
          }`}>
            <input
              type="radio"
              name="resetAction"
              checked={selectedAction === 'session'}
              onChange={() => setSelectedAction('session')}
              className="mt-1 text-saffron-600 focus:ring-saffron-500"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-brown-900 dark:text-cream-100 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
                Reset Active Session Count
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Sets current active chants to 0. <strong>Your saved history and settings remain safe.</strong>
              </p>
            </div>
          </label>

          {/* Option 2: Clear Session History */}
          <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedAction === 'history'
              ? 'bg-amber-100/70 dark:bg-stone-800 border-saffron-500 ring-2 ring-saffron-500/20'
              : 'bg-white dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-amber-300'
          }`}>
            <input
              type="radio"
              name="resetAction"
              checked={selectedAction === 'history'}
              onChange={() => setSelectedAction('history')}
              className="mt-1 text-saffron-600 focus:ring-saffron-500"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-amber-600" />
                Clear Session History
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Deletes all past recorded sessions. Current active session is kept.
              </p>
            </div>
          </label>

          {/* Option 3: Reset All Application Data */}
          <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedAction === 'all'
              ? 'bg-red-50 dark:bg-red-950/40 border-red-500 ring-2 ring-red-500/20'
              : 'bg-white dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-red-300'
          }`}>
            <input
              type="radio"
              name="resetAction"
              checked={selectedAction === 'all'}
              onChange={() => setSelectedAction('all')}
              className="mt-1 text-red-600 focus:ring-red-500"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Reset All Application Data
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Completely restores initial factory state. Erases active count, history, and custom settings.
              </p>
            </div>
          </label>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200/50 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedAction}
            onClick={handleConfirm}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition-all ${
              selectedAction === 'all'
                ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                : selectedAction
                ? 'bg-saffron-600 hover:bg-saffron-700 active:scale-95'
                : 'bg-stone-300 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
            }`}
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
