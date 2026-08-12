import { formatDuration } from '@/lib/time';

interface StatsSummaryProps {
  todaySeconds: number;
  yesterdaySeconds: number;
  weekSeconds: number;
  streak: number;
  focusCount: number;
}

interface CardProps {
  label: string;
  value: string;
  hint: string;
  accent: string;
}

function Card({ label, value, hint, accent }: CardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tabular-nums ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{hint}</p>
    </div>
  );
}

export function StatsSummary({
  todaySeconds,
  yesterdaySeconds,
  weekSeconds,
  streak,
  focusCount,
}: StatsSummaryProps) {
  const diff = todaySeconds - yesterdaySeconds;
  const comparison =
    yesterdaySeconds === 0 && todaySeconds === 0
      ? 'No focus time yet'
      : diff === 0
        ? 'Same as yesterday'
        : diff > 0
          ? `${formatDuration(diff)} more than yesterday`
          : `${formatDuration(-diff)} less than yesterday`;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card
        label="Today"
        value={formatDuration(todaySeconds)}
        hint={comparison}
        accent="text-[#7df9ff] [text-shadow:0_0_18px_rgba(0,240,255,0.6)]"
      />
      <Card
        label="Last 7 days"
        value={formatDuration(weekSeconds)}
        hint={`${focusCount} session${focusCount === 1 ? '' : 's'} recorded in total`}
        accent="text-[#8dff6f] [text-shadow:0_0_18px_rgba(57,255,20,0.5)]"
      />
      <Card
        label="Streak"
        value={`${streak} day${streak === 1 ? '' : 's'}`}
        hint={streak > 0 ? 'Keep it going' : 'Finish a session to start one'}
        accent="text-[#ff86e4] [text-shadow:0_0_18px_rgba(255,47,208,0.5)]"
      />
    </div>
  );
}
