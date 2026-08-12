import { useMemo, useState } from 'react';
import type { SessionRecord } from '@/types/pomodoro';
import { dayKey, formatDuration, formatTimeOfDay, friendlyDayLabel } from '@/lib/time';

interface SessionListProps {
  sessions: SessionRecord[];
  onClear: () => void;
}

export function SessionList({ sessions, onClear }: SessionListProps) {
  const [confirming, setConfirming] = useState(false);

  const groups = useMemo(() => {
    const focusOnly = sessions.filter((s) => s.mode === 'focus');
    const map = new Map<string, SessionRecord[]>();
    for (const session of focusOnly) {
      const key = dayKey(session.completedAt);
      const list = map.get(key);
      if (list) list.push(session);
      else map.set(key, [session]);
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => ({
        key,
        items: items.sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1)),
        total: items.reduce((sum, s) => sum + s.durationSeconds, 0),
      }));
  }, [sessions]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Session history</h2>
        {confirming ? (
          <span className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">Delete everything?</span>
            <button
              onClick={() => {
                onClear();
                setConfirming(false);
              }}
              className="rounded-full bg-neutral-100 px-3 py-1 font-semibold text-neutral-900 transition hover:bg-white"
            >
              Yes, clear
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded-full border border-white/15 px-3 py-1 text-neutral-300 transition hover:bg-white/10"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-neutral-500 underline underline-offset-4 transition hover:text-neutral-300"
          >
            Clear history
          </button>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {groups.map((group) => (
          <div key={group.key}>
            <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-semibold text-neutral-200">
                {friendlyDayLabel(group.key)}
              </h3>
              <span className="text-xs tabular-nums text-neutral-400">
                {formatDuration(group.total)}
              </span>
            </div>
            <ul className="mt-1 divide-y divide-white/5">
              {group.items.map((session) => (
                <li key={session.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-neutral-200">{session.task}</p>
                    <p className="text-xs text-neutral-500">
                      finished {formatTimeOfDay(session.completedAt)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs tabular-nums text-neutral-300">
                    {formatDuration(session.durationSeconds)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
