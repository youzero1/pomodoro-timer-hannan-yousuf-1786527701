import { formatDuration } from '@/lib/time';

interface DailyGoalBarProps {
  todaySeconds: number;
  goalMinutes: number;
}

export function DailyGoalBar({ todaySeconds, goalMinutes }: DailyGoalBarProps) {
  if (goalMinutes <= 0) return null;

  const goalSeconds = goalMinutes * 60;
  const ratio = goalSeconds > 0 ? todaySeconds / goalSeconds : 0;
  const percent = Math.min(100, Math.round(ratio * 100));
  const reached = todaySeconds >= goalSeconds;
  const remainingSeconds = Math.max(0, goalSeconds - todaySeconds);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Daily goal
        </span>
        <span className="text-xs tabular-nums text-neutral-400">
          <span className="font-semibold text-neutral-200">{formatDuration(todaySeconds)}</span>
          {' / '}
          {formatDuration(goalSeconds)}
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Daily focus goal progress"
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            reached ? 'bg-white' : 'bg-neutral-300'
          }`}
          style={{ width: `${Math.max(percent, todaySeconds > 0 ? 2 : 0)}%` }}
        />
      </div>

      <p className="mt-2 text-center text-xs text-neutral-500">
        {reached
          ? `Goal reached — ${percent}% of today's target`
          : `${formatDuration(remainingSeconds)} to go`}
      </p>
    </div>
  );
}
