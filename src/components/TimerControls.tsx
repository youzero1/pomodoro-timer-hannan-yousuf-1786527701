import { MODE_THEMES, type TimerMode } from '@/types/pomodoro';

interface TimerControlsProps {
  mode: TimerMode;
  isRunning: boolean;
  canStart: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

const secondary =
  'rounded-full border border-white/10 px-5 py-3 text-sm text-neutral-300 transition hover:border-[#00f0ff]/40 hover:text-[#7df9ff] outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]/60';

export function TimerControls({
  mode,
  isRunning,
  canStart,
  onToggle,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const theme = MODE_THEMES[mode];
  const startDisabled = !isRunning && !canStart;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onToggle}
          disabled={startDisabled}
          className={`rounded-full px-10 py-3 text-sm font-semibold uppercase tracking-widest transition outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            startDisabled ? 'cursor-not-allowed bg-white/10 text-neutral-500' : theme.button
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={onReset} className={secondary}>
          Reset
        </button>
        <button onClick={onSkip} className={secondary}>
          Skip
        </button>
      </div>
      {startDisabled && (
        <p className="text-xs text-neutral-500">Name what you are working on to start focusing.</p>
      )}
    </div>
  );
}
