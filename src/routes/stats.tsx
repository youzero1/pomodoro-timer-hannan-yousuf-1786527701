import { createFileRoute, Link } from '@tanstack/react-router';
import { StatsSummary } from '@/components/StatsSummary';
import { DailyFocusChart } from '@/components/DailyFocusChart';
import { SessionList } from '@/components/SessionList';
import { useSessions } from '@/hooks/useSessions';

export const Route = createFileRoute('/stats')({
  component: StatsPage,
});

function StatsPage() {
  const {
    sessions,
    todaySeconds,
    yesterdaySeconds,
    weekSeconds,
    streak,
    focusCount,
    last7Days,
    clearHistory,
  } = useSessions();

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">
        <span className="text-4xl">📊</span>
        <h1 className="text-lg font-semibold text-white">No focus time recorded yet</h1>
        <p className="max-w-xs text-sm text-neutral-400">
          Finish your first focus session and your daily totals will show up here.
        </p>
        <Link
          to="/"
          className="rounded-full bg-[#00f0ff] px-6 py-2 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(0,240,255,0.9)] transition hover:bg-[#5cf7ff]"
        >
          Start a session
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <h1 className="text-xl font-semibold text-[#7df9ff] [text-shadow:0_0_18px_rgba(0,240,255,0.6)]">
        Your focus stats
      </h1>

      <StatsSummary
        todaySeconds={todaySeconds}
        yesterdaySeconds={yesterdaySeconds}
        weekSeconds={weekSeconds}
        streak={streak}
        focusCount={focusCount}
      />

      <DailyFocusChart days={last7Days} />

      <SessionList sessions={sessions} onClear={clearHistory} />
    </div>
  );
}
