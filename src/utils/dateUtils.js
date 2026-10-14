/**
 * Date and time formatting utilities for local calendar tracking
 */

/**
 * Returns today's local date string in YYYY-MM-DD format
 */
export function getTodayLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats an ISO string or date into a user-friendly date string
 */
export function formatDisplayDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const today = getTodayLocalDateString();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const targetDateStr = `${year}-${month}-${day}`;

  if (targetDateStr === today) {
    return 'Today';
  }

  // Check yesterday
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yYear = yesterdayDate.getFullYear();
  const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
  if (targetDateStr === `${yYear}-${yMonth}-${yDay}`) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats an ISO string or date into a localized time string (e.g. "2:45 PM")
 */
export function formatDisplayTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Calculates duration between two ISO timestamps
 */
export function formatSessionDuration(startInput, endInput) {
  if (!startInput) return '—';
  const start = new Date(startInput).getTime();
  const end = endInput ? new Date(endInput).getTime() : Date.now();
  if (isNaN(start) || isNaN(end)) return '—';

  const diffSec = Math.max(0, Math.floor((end - start) / 1000));
  if (diffSec < 60) {
    return `${diffSec}s`;
  }
  const mins = Math.floor(diffSec / 60);
  const remainingSec = diffSec % 60;
  if (mins < 60) {
    return `${mins}m ${remainingSec}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}
