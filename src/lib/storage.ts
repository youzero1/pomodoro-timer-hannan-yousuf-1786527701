import { DEFAULT_SETTINGS, type Settings, type SessionRecord } from '@/types/pomodoro';

const KEYS = {
  settings: 'pomodoro.settings.v1',
  sessions: 'pomodoro.sessions.v1',
  lastTask: 'pomodoro.lastTask.v1',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable / full — ignore
  }
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? Math.round(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function loadSettings(): Settings {
  const raw = read<Partial<Settings>>(KEYS.settings, {});
  return {
    focusMinutes: clampInt(raw.focusMinutes, 1, 180, DEFAULT_SETTINGS.focusMinutes),
    shortBreakMinutes: clampInt(raw.shortBreakMinutes, 1, 60, DEFAULT_SETTINGS.shortBreakMinutes),
    longBreakMinutes: clampInt(raw.longBreakMinutes, 1, 120, DEFAULT_SETTINGS.longBreakMinutes),
    sessionsBeforeLongBreak: clampInt(
      raw.sessionsBeforeLongBreak,
      1,
      12,
      DEFAULT_SETTINGS.sessionsBeforeLongBreak,
    ),
    autoStartNext:
      typeof raw.autoStartNext === 'boolean' ? raw.autoStartNext : DEFAULT_SETTINGS.autoStartNext,
    soundOnComplete:
      typeof raw.soundOnComplete === 'boolean'
        ? raw.soundOnComplete
        : DEFAULT_SETTINGS.soundOnComplete,
    dailyGoalMinutes: clampInt(raw.dailyGoalMinutes, 0, 960, DEFAULT_SETTINGS.dailyGoalMinutes),
  };
}

export function saveSettings(settings: Settings): void {
  write(KEYS.settings, settings);
}

export function loadSessions(): SessionRecord[] {
  const raw = read<unknown>(KEYS.sessions, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is SessionRecord => {
    if (!item || typeof item !== 'object') return false;
    const s = item as Partial<SessionRecord>;
    return (
      typeof s.id === 'string' &&
      typeof s.task === 'string' &&
      typeof s.durationSeconds === 'number' &&
      typeof s.completedAt === 'string' &&
      (s.mode === 'focus' || s.mode === 'shortBreak' || s.mode === 'longBreak')
    );
  });
}

export function saveSessions(sessions: SessionRecord[]): void {
  write(KEYS.sessions, sessions);
}

export function loadLastTask(): string {
  const raw = read<unknown>(KEYS.lastTask, '');
  return typeof raw === 'string' ? raw : '';
}

export function saveLastTask(task: string): void {
  write(KEYS.lastTask, task);
}
