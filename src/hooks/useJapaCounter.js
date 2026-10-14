import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  loadAppData,
  saveAppData,
  getInitialAppData,
  createNewActiveSession,
  endActiveSession,
  calculateLifetimeTotal,
  calculateDailyTotal,
  getMalaStats,
  exportDataAsJson,
  importDataFromJson
} from '../utils/storage';
import { playMalaCompletionBell, playBeadTapSound } from '../utils/audio';
import { getTodayLocalDateString } from '../utils/dateUtils';
import { DEFAULT_MANTRA_ID } from '../utils/mantraConfig';

/**
 * Main State Management Hook for Japa Counter
 */
export function useJapaCounter() {
  const [appData, setAppData] = useState(() => loadAppData());
  const [justCompletedGoal, setJustCompletedGoal] = useState(false);
  const [beadIncrementKey, setBeadIncrementKey] = useState(0);

  const lastTapTimeRef = useRef(0);
  const isGoalTriggeredRef = useRef(false);

  // Sync state to LocalStorage whenever appData changes
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  // Apply light/dark theme class to html element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isDark = appData.settings.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appData.settings.theme]);

  const { activeSession, history, settings } = appData;
  const sessionCount = activeSession?.count || 0;
  const { completedMalas, currentMalaProgress, beadsRemainingInMala } = getMalaStats(sessionCount);

  const lifetimeTotal = calculateLifetimeTotal(history, activeSession);
  const todayTotal = calculateDailyTotal(history, activeSession);
  const dailyGoal = settings.dailyGoal || 108;
  const goalProgressPercent = Math.min(100, Math.round((todayTotal / dailyGoal) * 100));
  const chantsRemainingForGoal = Math.max(0, dailyGoal - todayTotal);

  /**
   * Helper to trigger goal celebration
   */
  const triggerCelebration = useCallback(() => {
    setJustCompletedGoal(true);
    setTimeout(() => setJustCompletedGoal(false), 5000);

    try {
      // Golden devotional confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FF6B00', '#FFD700', '#FFA500', '#FFF8E7'],
        disableForReducedMotion: true,
      });
    } catch (e) {
      // Non-blocking
    }
  }, []);

  /**
   * Checks if daily goal has just been completed today and triggers celebration
   */
  const checkGoalAchievement = useCallback((newTodayTotal, currentSettings) => {
    const todayStr = getTodayLocalDateString();
    if (newTodayTotal >= currentSettings.dailyGoal && currentSettings.lastGoalCompletedDate !== todayStr) {
      triggerCelebration();
      return {
        ...currentSettings,
        lastGoalCompletedDate: todayStr
      };
    }
    return currentSettings;
  }, [triggerCelebration]);

  /**
   * Manual Count Increment
   * - Strict debounce / interaction lock (~120ms) to prevent double counting
   * - Vibrates on mobile where supported
   * - Triggers bell on 108 milestones
   */
  const incrementManual = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 120) {
      return; // Ignore accidental double touch/click
    }
    lastTapTimeRef.current = now;

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([22]);
      } catch (e) {
        // Safe
      }
    }

    setAppData(prev => {
      const prevCount = prev.activeSession.count;
      const newCount = prevCount + 1;
      const modesUsed = prev.activeSession.modesUsed.includes('manual')
        ? prev.activeSession.modesUsed
        : [...prev.activeSession.modesUsed, 'manual'];

      // Milestone check: every 108 counts completes one mala
      if (newCount > 0 && newCount % 108 === 0) {
        playMalaCompletionBell(prev.settings.soundEnabled);
      } else {
        playBeadTapSound(prev.settings.soundEnabled);
      }

      const todayStr = getTodayLocalDateString();
      const newTodayTotal = calculateDailyTotal(prev.history, { ...prev.activeSession, count: newCount }, todayStr);
      const updatedSettings = checkGoalAchievement(newTodayTotal, prev.settings);

      return {
        ...prev,
        activeSession: {
          ...prev.activeSession,
          count: newCount,
          modesUsed
        },
        settings: updatedSettings
      };
    });

    setBeadIncrementKey(k => k + 1);
  }, [checkGoalAchievement]);

  /**
   * Voice Count Increment
   * - Adds recognized counts from finalized transcript
   * - Checks if mala boundary or daily goal is crossed
   */
  const incrementVoice = useCallback((countDelta, transcript = '') => {
    if (!countDelta || countDelta <= 0) return;

    setAppData(prev => {
      const prevCount = prev.activeSession.count;
      const newCount = prevCount + countDelta;

      const modesUsed = prev.activeSession.modesUsed.includes('voice')
        ? prev.activeSession.modesUsed
        : [...prev.activeSession.modesUsed, 'voice'];

      // Check if any 108 milestone was crossed
      const oldMalas = Math.floor(prevCount / 108);
      const newMalas = Math.floor(newCount / 108);
      if (newMalas > oldMalas) {
        playMalaCompletionBell(prev.settings.soundEnabled);
      }

      const todayStr = getTodayLocalDateString();
      const newTodayTotal = calculateDailyTotal(prev.history, { ...prev.activeSession, count: newCount }, todayStr);
      const updatedSettings = checkGoalAchievement(newTodayTotal, prev.settings);

      return {
        ...prev,
        activeSession: {
          ...prev.activeSession,
          count: newCount,
          modesUsed
        },
        settings: updatedSettings
      };
    });

    setBeadIncrementKey(k => k + 1);
  }, [checkGoalAchievement]);

  /**
   * Sets the active mantra without resetting history
   */
  const setMantra = useCallback((mantraId) => {
    setAppData(prev => ({
      ...prev,
      activeSession: {
        ...prev.activeSession,
        mantraId
      }
    }));
  }, []);

  /**
   * Ends current session and saves it as a single history record
   */
  const endCurrentSession = useCallback(() => {
    setAppData(prev => endActiveSession(prev));
  }, []);

  /**
   * Resets active session counter to 0 (history untouched)
   */
  const resetCurrentSession = useCallback(() => {
    setAppData(prev => ({
      ...prev,
      activeSession: createNewActiveSession(prev.activeSession?.mantraId || prev.settings?.defaultMantra)
    }));
  }, []);

  /**
   * Deletes a single session from history
   */
  const deleteHistorySession = useCallback((sessionId) => {
    setAppData(prev => ({
      ...prev,
      history: prev.history.filter(s => s.id !== sessionId)
    }));
  }, []);

  /**
   * Clears all past history (preserves active session and settings)
   */
  const clearAllHistory = useCallback(() => {
    setAppData(prev => ({
      ...prev,
      history: []
    }));
  }, []);

  /**
   * Updates user settings
   */
  const updateSettings = useCallback((newSettingsPartial) => {
    setAppData(prev => {
      const merged = { ...prev.settings, ...newSettingsPartial };
      return {
        ...prev,
        settings: merged
      };
    });
  }, []);

  /**
   * Resets all application data to original factory defaults
   */
  const resetAllApplicationData = useCallback(() => {
    const initial = getInitialAppData();
    setAppData(initial);
    saveAppData(initial);
  }, []);

  /**
   * Exports data as JSON string
   */
  const exportData = useCallback(() => {
    return exportDataAsJson(appData);
  }, [appData]);

  /**
   * Imports data from JSON string
   */
  const importData = useCallback((jsonString) => {
    const imported = importDataFromJson(jsonString);
    setAppData(imported);
    return imported;
  }, []);

  return {
    appData,
    activeSession,
    sessionCount,
    completedMalas,
    currentMalaProgress,
    beadsRemainingInMala,
    lifetimeTotal,
    todayTotal,
    dailyGoal,
    goalProgressPercent,
    chantsRemainingForGoal,
    justCompletedGoal,
    beadIncrementKey,
    settings,
    history,
    incrementManual,
    incrementVoice,
    setMantra,
    endCurrentSession,
    resetCurrentSession,
    deleteHistorySession,
    clearAllHistory,
    updateSettings,
    resetAllApplicationData,
    exportData,
    importData
  };
}
