import type { SessionRecord } from '@/types/pomodoro';

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** "1h 25m", "45m", "0m" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(Math.max(0, totalSeconds) / 60);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

/** Local YYYY-MM-DD */
export function dayKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Oldest → newest list of the last n local day keys, ending today. */
export function lastNDayKeys(n: number, from: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(from);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}

/** Map of day key → total focus seconds. */
export function focusSecondsByDay(sessions: SessionRecord[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const session of sessions) {
    if (session.mode !== 'focus') continue;
    const key = dayKey(session.completedAt);
    totals[key] = (totals[key] ?? 0) + session.durationSeconds;
  }
  return totals;
}

export function shortWeekday(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

export function friendlyDayLabel(key: string): string {
  const today = dayKey(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  if (key === today) return 'Today';
  if (key === dayKey(yesterdayDate)) return 'Yesterday';
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export function formatTimeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** Consecutive days (ending today or yesterday) with at least one focus session. */
export function currentStreak(sessions: SessionRecord[]): number {
  const totals = focusSecondsByDay(sessions);
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  if (!totals[dayKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1);
    if (!totals[dayKey(cursor)]) return 0;
  }
  let streak = 0;
  while (totals[dayKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
