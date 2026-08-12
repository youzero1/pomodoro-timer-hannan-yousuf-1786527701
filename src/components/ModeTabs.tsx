import { MODE_LABELS, MODE_THEMES, type TimerMode } from '@/types/pomodoro';

interface ModeTabsProps {
  mode: TimerMode;
  onChange: (mode: TimerMode) => void;
}

const MODES: TimerMode[] = ['focus', 'shortBreak', 'longBreak'];

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Timer mode"
      className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {MODES.map((m) => {
        const active = mode === m;
        const theme = MODE_THEMES[m];
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:px-4 sm:text-sm ${
              active ? `${theme.bgSoft} ${theme.text}` : 'text-neutral-400 hover:text-neutral-100'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        );
      })}
    </div>
  );
}
