import React, { useState } from 'react';
import { MANTRAS } from '../utils/mantraConfig';
import { formatDisplayDate, formatDisplayTime, formatSessionDuration } from '../utils/dateUtils';
import {
  Calendar,
  Clock,
  Trash2,
  Sparkles,
  Award,
  Layers,
  Mic,
  Hand,
  Combine,
  AlertTriangle
} from 'lucide-react';

export default function History({ japaState }) {
  const {
    history = [],
    activeSession,
    lifetimeTotal = 0,
    todayTotal = 0,
    deleteHistorySession,
    clearAllHistory
  } = japaState;

  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Group stats
  const totalCompletedMalas = history.reduce((acc, curr) => acc + (curr.completedMalas || 0), 0);
  const totalSessionsCount = history.length;

  const getMantraInfo = (mantraId) => {
    return MANTRAS.find(m => m.id === mantraId) || { name: 'Mantra', sanskrit: 'मंत्र' };
  };

  const getModeBadge = (mode) => {
    if (mode === 'audio') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <Mic className="w-3 h-3" /> Voice
        </span>
      );
    }
    if (mode === 'mixed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
          <Combine className="w-3 h-3" /> Mixed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
        <Hand className="w-3 h-3" /> Manual
      </span>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 px-4 pt-3 select-none">
      {/* Header Title & Actions */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-brown-900 dark:text-cream-100 flex items-center gap-2">
            <span>Session History</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Past completed chanting sessions and milestones
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Aggregate Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 flex flex-col items-center text-center">
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Today Chanted</span>
          <span className="text-xl font-extrabold text-saffron-600 dark:text-saffron-400 mt-0.5">
            {todayTotal.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 flex flex-col items-center text-center">
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Lifetime Total</span>
          <span className="text-xl font-extrabold text-amber-700 dark:text-gold-400 mt-0.5">
            {lifetimeTotal.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 flex flex-col items-center text-center">
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Malas Done</span>
          <span className="text-xl font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">
            {totalCompletedMalas}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 flex flex-col items-center text-center">
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Sessions</span>
          <span className="text-xl font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">
            {totalSessionsCount}
          </span>
        </div>
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="w-full p-8 rounded-3xl bg-cream-50/60 dark:bg-stone-900/40 border border-amber-200/40 dark:border-stone-800 text-center flex flex-col items-center justify-center my-6">
          <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-stone-800 text-saffron-600 dark:text-saffron-400 flex items-center justify-center mb-3">
            <span className="font-devanagari text-2xl font-bold">ॐ</span>
          </div>
          <h3 className="font-bold text-base text-brown-900 dark:text-cream-100">
            No Saved Sessions Yet
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mt-1 leading-relaxed">
            When you complete chanting on the Home screen and tap <strong>"Save & End Session"</strong>, your records will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session) => {
            const mantra = getMantraInfo(session.mantraId);
            return (
              <div
                key={session.id}
                className="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-amber-200/60 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                {/* Left side: Mantra & Count */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-devanagari font-bold text-base text-saffron-600 dark:text-saffron-400">
                      {mantra.sanskrit}
                    </span>
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 truncate">
                      ({mantra.name})
                    </span>
                    {getModeBadge(session.countingMode)}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDisplayDate(session.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDisplayTime(session.startTime)}
                    </span>
                    <span className="text-stone-400 dark:text-stone-600">•</span>
                    <span>
                      Duration: {formatSessionDuration(session.startTime, session.endTime)}
                    </span>
                  </div>
                </div>

                {/* Right side: Count & Malas */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-extrabold font-sans text-brown-900 dark:text-cream-100 leading-none">
                      {session.totalCount.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                      {session.completedMalas} {session.completedMalas === 1 ? 'Mala' : 'Malas'}
                    </div>
                  </div>

                  {/* Delete individual session */}
                  <button
                    type="button"
                    onClick={() => setSessionToDelete(session)}
                    aria-label="Delete this session record"
                    className="p-2 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Single Session Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-cream-50 dark:bg-stone-900 rounded-3xl border border-amber-200 dark:border-stone-800 p-6 shadow-2xl">
            <h4 className="font-bold text-base text-brown-900 dark:text-cream-100 mb-2">
              Delete Chanting Session?
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              Are you sure you want to delete this record of <strong>{sessionToDelete.totalCount} chants</strong> on {formatDisplayDate(sessionToDelete.date)}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteHistorySession(sessionToDelete.id);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-cream-50 dark:bg-stone-900 rounded-3xl border border-amber-200 dark:border-stone-800 p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-base text-brown-900 dark:text-cream-100">
                Clear All Session History?
              </h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              This will permanently delete all {history.length} saved chanting session records. Your current active count and settings will remain safe.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
