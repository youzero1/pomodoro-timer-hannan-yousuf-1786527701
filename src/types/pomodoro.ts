export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Settings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartNext: boolean;
  soundOnComplete: boolean;
  dailyGoalMinutes: number;
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
  dailyGoalMinutes: 120,
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
    ring: '#fafafa',
    text: 'text-neutral-100',
    bgSoft: 'bg-white/10',
    border: 'border-white/30',
    button: 'bg-neutral-100 hover:bg-white text-neutral-900',
    glow: 'shadow-[0_0_80px_-24px_rgba(255,255,255,0.45)]',
  },
  shortBreak: {
    ring: '#a3a3a3',
    text: 'text-neutral-300',
    bgSoft: 'bg-white/[0.07]',
    border: 'border-white/20',
    button: 'bg-neutral-300 hover:bg-neutral-200 text-neutral-900',
    glow: 'shadow-[0_0_80px_-24px_rgba(163,163,163,0.4)]',
  },
  longBreak: {
    ring: '#737373',
    text: 'text-neutral-400',
    bgSoft: 'bg-white/[0.05]',
    border: 'border-white/15',
    button: 'bg-neutral-400 hover:bg-neutral-300 text-neutral-900',
    glow: 'shadow-[0_0_80px_-24px_rgba(115,115,115,0.4)]',
  },
};
