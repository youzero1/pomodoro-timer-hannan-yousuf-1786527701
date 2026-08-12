import { useState } from 'react';
import type { DayTotal } from '@/hooks/useSessions';
import { dayKey, formatDuration, shortWeekday } from '@/lib/time';

interface DailyFocusChartProps {
  days: DayTotal[];
}

export function DailyFocusChart({ days }: DailyFocusChartProps) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...days.map((d) => d.seconds), 1);
  const today = dayKey(new Date());
  const hasData = days.some((d) => d.seconds > 0);
  const best = days.reduce((a, b) => (b.seconds > a.seconds ? b : a), days[0]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
          Focus time per day
        </h2>
        {hasData && (
          <span className="text-xs text-neutral-500">
            Best: {formatDuration(best.seconds)} on {shortWeekday(best.key)}
          </span>
        )}
      </div>

      <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-3">
        {days.map((day) => {
          const isToday = day.key === today;
          const heightPct = day.seconds > 0 ? Math.max(4, (day.seconds / max) * 100) : 2;
          return (
            <button
              key={day.key}
              type="button"
              onMouseEnter={() => setActive(day.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(day.key)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((prev) => (prev === day.key ? null : day.key))}
              aria-label={`${shortWeekday(day.key)}: ${formatDuration(day.seconds)} of focus`}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-2 outline-none"
            >
              <span
                className={`h-5 text-[10px] font-medium tabular-nums transition ${
                  active === day.key ? 'text-[#7df9ff] opacity-100' : 'text-neutral-400 opacity-0'
                }`}
              >
                {formatDuration(day.seconds)}
              </span>
              <span
                className={`w-full rounded-t-md transition-all duration-300 ${
                  day.seconds === 0
                    ? 'bg-white/10'
                    : isToday
                      ? 'bg-[#00f0ff] shadow-[0_0_20px_-2px_rgba(0,240,255,0.9)]'
                      : 'bg-[#00f0ff]/40 group-hover:bg-[#00f0ff]/80 group-hover:shadow-[0_0_18px_-2px_rgba(0,240,255,0.7)]'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <span
                className={`text-[10px] ${isToday ? 'font-semibold text-[#7df9ff]' : 'text-neutral-500'}`}
              >
                {shortWeekday(day.key)}
              </span>
            </button>
          );
        })}
      </div>

      {!hasData && (
        <p className="mt-4 text-center text-xs text-neutral-500">
          No focus time in the last 7 days yet.
        </p>
      )}
    </section>
  );
}
