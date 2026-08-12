export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Settings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartNext: boolean;
  soundOnComplete: boolean;
}

export interface SessionRecord {
  id: string;
  task: string;
  mode: TimerMode;
  durationSeconds: number;
  completedAt: string; // ISO timestamp
}

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartNext: false,
  soundOnComplete: true,
};

export const MODE_LABELS: Record<TimerMode, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export interface ModeTheme {
  ring: string;
  text: string;
  bgSoft: string;
  border: string;
  button: string;
  glow: string;
}

export const MODE_THEMES: Record<TimerMode, ModeTheme> = {
  focus: {
    ring: '#f87171',
    text: 'text-rose-300',
    bgSoft: 'bg-rose-500/15',
    border: 'border-rose-400/40',
    button: 'bg-rose-500 hover:bg-rose-400 text-white',
    glow: 'shadow-[0_0_80px_-20px_rgba(248,113,113,0.7)]',
  },
  shortBreak: {
    ring: '#34d399',
    text: 'text-emerald-300',
    bgSoft: 'bg-emerald-500/15',
    border: 'border-emerald-400/40',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-white',
    glow: 'shadow-[0_0_80px_-20px_rgba(52,211,153,0.7)]',
  },
  longBreak: {
    ring: '#60a5fa',
    text: 'text-sky-300',
    bgSoft: 'bg-sky-500/15',
    border: 'border-sky-400/40',
    button: 'bg-sky-500 hover:bg-sky-400 text-white',
    glow: 'shadow-[0_0_80px_-20px_rgba(96,165,250,0.7)]',
  },
};
