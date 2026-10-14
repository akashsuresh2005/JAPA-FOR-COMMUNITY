/**
 * Persistent LocalStorage Manager with Schema Versioning & Safe Migration
 */

import { getTodayLocalDateString } from './dateUtils';
import { DEFAULT_MANTRA_ID } from './mantraConfig';

export const STORAGE_KEY = 'JAPA_DEVOTIONAL_DATA_V1';
export const STORAGE_VERSION = 1;

/**
 * Creates a fresh active session object
 */
export function createNewActiveSession(mantraId = DEFAULT_MANTRA_ID) {
  const now = new Date();
  return {
    id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: getTodayLocalDateString(),
    startTime: now.toISOString(),
    endTime: null,
    count: 0,
    mantraId: mantraId || DEFAULT_MANTRA_ID,
    modesUsed: [] // 'manual', 'voice'
  };
}

/**
 * Default settings configuration
 */
export function getDefaultSettings() {
  return {
    dailyGoal: 108,
    customGoal: 108,
    defaultMantra: DEFAULT_MANTRA_ID,
    soundEnabled: true,
    theme: 'light',
    speechLanguage: 'hi-IN',
    lastGoalCompletedDate: null
  };
}

/**
 * Returns initial clean state
 */
export function getInitialAppData() {
  const settings = getDefaultSettings();
  return {
    version: STORAGE_VERSION,
    activeSession: createNewActiveSession(settings.defaultMantra),
    history: [],
    settings
  };
}

/**
 * Validates and sanitizes loaded application data
 */
export function validateAndSanitizeData(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    return getInitialAppData();
  }

  const safeData = getInitialAppData();

  // Validate settings
  if (rawData.settings && typeof rawData.settings === 'object') {
    const rawGoal = Number(rawData.settings.dailyGoal);
    safeData.settings.dailyGoal = Number.isInteger(rawGoal) && rawGoal > 0 ? rawGoal : 108;
    const rawCustom = Number(rawData.settings.customGoal);
    safeData.settings.customGoal = Number.isInteger(rawCustom) && rawCustom > 0 ? rawCustom : 108;
    safeData.settings.defaultMantra = typeof rawData.settings.defaultMantra === 'string' ? rawData.settings.defaultMantra : DEFAULT_MANTRA_ID;
    safeData.settings.soundEnabled = rawData.settings.soundEnabled !== false;
    safeData.settings.theme = rawData.settings.theme === 'dark' ? 'dark' : 'light';
    safeData.settings.speechLanguage = typeof rawData.settings.speechLanguage === 'string' ? rawData.settings.speechLanguage : 'hi-IN';
    safeData.settings.lastGoalCompletedDate = typeof rawData.settings.lastGoalCompletedDate === 'string' ? rawData.settings.lastGoalCompletedDate : null;
  }

  // Validate activeSession
  if (rawData.activeSession && typeof rawData.activeSession === 'object') {
    const rawCount = Number(rawData.activeSession.count);
    safeData.activeSession = {
      id: typeof rawData.activeSession.id === 'string' ? rawData.activeSession.id : safeData.activeSession.id,
      date: typeof rawData.activeSession.date === 'string' ? rawData.activeSession.date : getTodayLocalDateString(),
      startTime: typeof rawData.activeSession.startTime === 'string' ? rawData.activeSession.startTime : new Date().toISOString(),
      endTime: rawData.activeSession.endTime || null,
      count: Number.isInteger(rawCount) && rawCount >= 0 ? rawCount : 0,
      mantraId: typeof rawData.activeSession.mantraId === 'string' ? rawData.activeSession.mantraId : safeData.settings.defaultMantra,
      modesUsed: Array.isArray(rawData.activeSession.modesUsed) ? rawData.activeSession.modesUsed : []
    };
  }

  // Validate history array
  if (Array.isArray(rawData.history)) {
    safeData.history = rawData.history.filter(item => {
      return (
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        Number.isInteger(Number(item.totalCount)) &&
        Number(item.totalCount) > 0
      );
    }).map(item => {
      const totalCount = Number(item.totalCount);
      let mode = 'manual';
      if (item.countingMode === 'audio' || item.countingMode === 'voice') mode = 'audio';
      else if (item.countingMode === 'mixed') mode = 'mixed';

      return {
        id: item.id,
        date: typeof item.date === 'string' ? item.date : getTodayLocalDateString(),
        startTime: typeof item.startTime === 'string' ? item.startTime : new Date().toISOString(),
        endTime: typeof item.endTime === 'string' ? item.endTime : new Date().toISOString(),
        totalCount,
        completedMalas: Math.floor(totalCount / 108),
        mantraId: typeof item.mantraId === 'string' ? item.mantraId : DEFAULT_MANTRA_ID,
        countingMode: mode
      };
    });
  }

  return safeData;
}

/**
 * Loads application data from LocalStorage
 */
export function loadAppData() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getInitialAppData();
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      const initial = getInitialAppData();
      saveAppData(initial);
      return initial;
    }
    const parsed = JSON.parse(serialized);
    return validateAndSanitizeData(parsed);
  } catch (err) {
    console.error('Failed to parse Japa storage, returning clean state:', err);
    return getInitialAppData();
  }
}

/**
 * Saves application data to LocalStorage
 */
export function saveAppData(data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Resolves counting mode string from array of modes used
 */
export function resolveCountingMode(modesUsed = []) {
  const hasManual = modesUsed.includes('manual');
  const hasVoice = modesUsed.includes('voice') || modesUsed.includes('audio');

  if (hasManual && hasVoice) return 'mixed';
  if (hasVoice) return 'audio';
  return 'manual';
}

/**
 * Ends active chanting session and creates a single history record.
 * Returns updated data object.
 */
export function endActiveSession(data) {
  const { activeSession, history } = data;
  if (!activeSession || activeSession.count <= 0) {
    // If no chants in session, just reset active session start time
    return {
      ...data,
      activeSession: createNewActiveSession(data.settings?.defaultMantra || DEFAULT_MANTRA_ID)
    };
  }

  const endTime = new Date().toISOString();
  const sessionRecord = {
    id: activeSession.id,
    date: activeSession.date || getTodayLocalDateString(),
    startTime: activeSession.startTime,
    endTime,
    totalCount: activeSession.count,
    completedMalas: Math.floor(activeSession.count / 108),
    mantraId: activeSession.mantraId,
    countingMode: resolveCountingMode(activeSession.modesUsed)
  };

  const updatedHistory = [sessionRecord, ...history];
  const updatedActiveSession = createNewActiveSession(activeSession.mantraId);

  const updatedData = {
    ...data,
    history: updatedHistory,
    activeSession: updatedActiveSession
  };

  saveAppData(updatedData);
  return updatedData;
}

/**
 * Calculates lifetime total chant count across history and active session.
 * Prevents double counting.
 */
export function calculateLifetimeTotal(history = [], activeSession = null) {
  const historyTotal = history.reduce((acc, curr) => acc + (Number(curr.totalCount) || 0), 0);
  const activeCount = activeSession ? (Number(activeSession.count) || 0) : 0;
  return historyTotal + activeCount;
}

/**
 * Calculates daily total chants for a given date (defaults to today's local date).
 * Includes completed history sessions for the day + current active session (if today).
 */
export function calculateDailyTotal(history = [], activeSession = null, targetDate = getTodayLocalDateString()) {
  const historyDaily = history
    .filter(item => item.date === targetDate)
    .reduce((acc, curr) => acc + (Number(curr.totalCount) || 0), 0);

  const activeDaily = (activeSession && activeSession.date === targetDate)
    ? (Number(activeSession.count) || 0)
    : 0;

  return historyDaily + activeDaily;
}

/**
 * Calculates completed malas and progress
 */
export function getMalaStats(count = 0) {
  const safeCount = Math.max(0, Number(count) || 0);
  return {
    completedMalas: Math.floor(safeCount / 108),
    currentMalaProgress: safeCount % 108,
    beadsRemainingInMala: (108 - (safeCount % 108)) % 108,
  };
}

/**
 * Exports data as formatted JSON string
 */
export function exportDataAsJson(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Validates and imports data from JSON string
 */
export function importDataFromJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure: Root must be an object.');
    }
    const validated = validateAndSanitizeData(parsed);
    saveAppData(validated);
    return validated;
  } catch (err) {
    throw new Error(`Import failed: ${err.message}`);
  }
}
