import { useCallback, useMemo, useState } from 'react';
import type { SessionRecord } from '@/types/pomodoro';
import { loadSessions, saveSessions } from '@/lib/storage';
import { currentStreak, dayKey, focusSecondsByDay, lastNDayKeys } from '@/lib/time';

export interface DayTotal {
  key: string;
  seconds: number;
}

export function useSessions() {
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessions());

  const persist = useCallback((next: SessionRecord[]) => {
    setSessions(next);
    saveSessions(next);
  }, []);

  const addSession = useCallback(
    (session: Omit<SessionRecord, 'id' | 'completedAt'> & { completedAt?: string }) => {
      const record: SessionRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        completedAt: session.completedAt ?? new Date().toISOString(),
        task: session.task,
        mode: session.mode,
        durationSeconds: session.durationSeconds,
      };
      setSessions((prev) => {
        const next = [record, ...prev];
        saveSessions(next);
        return next;
      });
    },
    [],
  );

  const clearHistory = useCallback(() => persist([]), [persist]);

  const totalsByDay = useMemo(() => focusSecondsByDay(sessions), [sessions]);

  const todaySeconds = totalsByDay[dayKey(new Date())] ?? 0;

  const yesterdaySeconds = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return totalsByDay[dayKey(d)] ?? 0;
  }, [totalsByDay]);

  const last7Days: DayTotal[] = useMemo(
    () => lastNDayKeys(7).map((key) => ({ key, seconds: totalsByDay[key] ?? 0 })),
    [totalsByDay],
  );

  const weekSeconds = useMemo(
    () => last7Days.reduce((sum, day) => sum + day.seconds, 0),
    [last7Days],
  );

  const streak = useMemo(() => currentStreak(sessions), [sessions]);

  const recentTasks = useMemo(() => {
    const seen: string[] = [];
    for (const session of sessions) {
      const name = session.task.trim();
      if (session.mode !== 'focus' || !name) continue;
      if (!seen.some((t) => t.toLowerCase() === name.toLowerCase())) seen.push(name);
      if (seen.length >= 5) break;
    }
    return seen;
  }, [sessions]);

  const focusCount = useMemo(
    () => sessions.filter((s) => s.mode === 'focus').length,
    [sessions],
  );

  return {
    sessions,
    addSession,
    clearHistory,
    totalsByDay,
    todaySeconds,
    yesterdaySeconds,
    last7Days,
    weekSeconds,
    streak,
    recentTasks,
    focusCount,
  };
}
