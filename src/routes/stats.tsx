import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stats')({
  component: StatsPage,
});

function StatsPage() {
  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-semibold">Your focus stats</h1>
      {/* StatsSummary placeholder */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 h-3 w-20 rounded bg-white/10" />
            <div className="h-8 w-24 rounded bg-white/20" />
          </div>
        ))}
      </div>
      {/* DailyFocusChart placeholder */}
      <div className="h-56 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="h-3 w-32 rounded bg-white/10" />
      </div>
    </div>
  );
}
