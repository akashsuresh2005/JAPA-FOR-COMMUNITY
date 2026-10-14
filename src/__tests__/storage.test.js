import { describe, it, expect } from 'vitest';
import {
  getMalaStats,
  calculateLifetimeTotal,
  calculateDailyTotal,
  resolveCountingMode,
  validateAndSanitizeData,
  endActiveSession,
  createNewActiveSession
} from '../utils/storage';

describe('Storage & Mala Math Calculations', () => {
  it('correctly calculates mala stats for 0 chants', () => {
    const stats = getMalaStats(0);
    expect(stats.completedMalas).toBe(0);
    expect(stats.currentMalaProgress).toBe(0);
    expect(stats.beadsRemainingInMala).toBe(0);
  });

  it('calculates 107 chants as 0 completed malas and 107 progress', () => {
    const stats = getMalaStats(107);
    expect(stats.completedMalas).toBe(0);
    expect(stats.currentMalaProgress).toBe(107);
    expect(stats.beadsRemainingInMala).toBe(1);
  });

  it('calculates 108 chants as exactly 1 completed mala and 0 progress', () => {
    const stats = getMalaStats(108);
    expect(stats.completedMalas).toBe(1);
    expect(stats.currentMalaProgress).toBe(0);
    expect(stats.beadsRemainingInMala).toBe(0);
  });

  it('calculates 216 chants as exactly 2 completed malas and 0 progress', () => {
    const stats = getMalaStats(216);
    expect(stats.completedMalas).toBe(2);
    expect(stats.currentMalaProgress).toBe(0);
  });

  it('resolves counting modes accurately (manual, audio, mixed)', () => {
    expect(resolveCountingMode(['manual'])).toBe('manual');
    expect(resolveCountingMode(['voice'])).toBe('audio');
    expect(resolveCountingMode(['manual', 'voice'])).toBe('mixed');
  });

  it('calculates lifetime totals without double counting', () => {
    const history = [
      { totalCount: 108 },
      { totalCount: 216 }
    ];
    const activeSession = { count: 54 };
    const total = calculateLifetimeTotal(history, activeSession);
    expect(total).toBe(108 + 216 + 54); // 378
  });

  it('calculates daily totals based on target local calendar date', () => {
    const history = [
      { date: '2026-10-14', totalCount: 108 },
      { date: '2026-10-13', totalCount: 216 }
    ];
    const activeSession = { date: '2026-10-14', count: 20 };
    const todayTotal = calculateDailyTotal(history, activeSession, '2026-10-14');
    expect(todayTotal).toBe(128); // 108 + 20
  });

  it('ends active session by creating 1 history item and clearing active count', () => {
    const initialSession = {
      id: 'sess_test_1',
      date: '2026-10-14',
      startTime: '2026-10-14T10:00:00.000Z',
      endTime: null,
      count: 108,
      mantraId: 'rama',
      modesUsed: ['manual']
    };
    const data = {
      version: 1,
      activeSession: initialSession,
      history: [],
      settings: { defaultMantra: 'rama' }
    };

    const updated = endActiveSession(data);
    expect(updated.history.length).toBe(1);
    expect(updated.history[0].totalCount).toBe(108);
    expect(updated.history[0].completedMalas).toBe(1);
    expect(updated.history[0].countingMode).toBe('manual');
    expect(updated.activeSession.count).toBe(0);
    expect(updated.activeSession.id).not.toBe('sess_test_1');
  });

  it('safely sanitizes malformed data', () => {
    const badData = { version: 'invalid', activeSession: 'corrupt', history: null, settings: {} };
    const sanitized = validateAndSanitizeData(badData);
    expect(sanitized.version).toBe(1);
    expect(sanitized.activeSession.count).toBe(0);
    expect(Array.isArray(sanitized.history)).toBe(true);
    expect(sanitized.settings.dailyGoal).toBe(108);
  });
});
