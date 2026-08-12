import { MODE_LABELS, MODE_THEMES, type TimerMode } from '@/types/pomodoro';
import { formatClock } from '@/lib/time';

interface TimerDisplayProps {
  mode: TimerMode;
  remaining: number;
  progress: number;
  isRunning: boolean;
  sessionIndex: number;
  sessionsBeforeLongBreak: number;
}

const SIZE = 280;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerDisplay({
  mode,
  remaining,
  progress,
  isRunning,
  sessionIndex,
  sessionsBeforeLongBreak,
}: TimerDisplayProps) {
  const theme = MODE_THEMES[mode];
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = CIRCUMFERENCE * clamped;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative aspect-square w-[min(80vw,280px)] rounded-full ${isRunning ? theme.glow : ''}`}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={theme.ring}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.4s linear, stroke 0.3s ease' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${theme.text}`}
            aria-live="polite"
          >
            {MODE_LABELS[mode]}
          </span>
          <span
            className="mt-1 font-mono text-6xl font-semibold tabular-nums text-white sm:text-7xl"
            role="timer"
            aria-label={`${formatClock(remaining)} remaining`}
          >
            {formatClock(remaining)}
          </span>
          <span className="mt-2 text-xs text-slate-400">
            Session {sessionIndex} of {sessionsBeforeLongBreak}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              i < sessionIndex - 1 || (i === sessionIndex - 1 && clamped > 0)
                ? 'bg-white/80'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
