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
    ring: '#00f0ff',
    text: 'text-[#7df9ff]',
    bgSoft: 'bg-[#00f0ff]/15',
    border: 'border-[#00f0ff]/50',
    button:
      'bg-[#00f0ff] hover:bg-[#5cf7ff] text-black shadow-[0_0_24px_-2px_rgba(0,240,255,0.7)]',
    glow: 'shadow-[0_0_90px_-18px_rgba(0,240,255,0.75)]',
  },
  shortBreak: {
    ring: '#39ff14',
    text: 'text-[#8dff6f]',
    bgSoft: 'bg-[#39ff14]/15',
    border: 'border-[#39ff14]/50',
    button:
      'bg-[#39ff14] hover:bg-[#7cff5e] text-black shadow-[0_0_24px_-2px_rgba(57,255,20,0.7)]',
    glow: 'shadow-[0_0_90px_-18px_rgba(57,255,20,0.7)]',
  },
  longBreak: {
    ring: '#ff2fd0',
    text: 'text-[#ff86e4]',
    bgSoft: 'bg-[#ff2fd0]/15',
    border: 'border-[#ff2fd0]/50',
    button:
      'bg-[#ff2fd0] hover:bg-[#ff6ade] text-black shadow-[0_0_24px_-2px_rgba(255,47,208,0.7)]',
    glow: 'shadow-[0_0_90px_-18px_rgba(255,47,208,0.7)]',
  },
};
