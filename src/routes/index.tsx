import { useCallback, useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { TimerDisplay } from '@/components/TimerDisplay';
import { ModeTabs } from '@/components/ModeTabs';
import { TimerControls } from '@/components/TimerControls';
import { TaskInput } from '@/components/TaskInput';
import { useSettings } from '@/hooks/useSettings';
import { useSessions } from '@/hooks/useSessions';
import { useTimer } from '@/hooks/useTimer';
import { MODE_LABELS, MODE_THEMES, type TimerMode } from '@/types/pomodoro';
import { formatClock, formatDuration } from '@/lib/time';
import { loadLastTask, saveLastTask } from '@/lib/storage';
import { playChime, setTabTitle, showNotification } from '@/lib/notify';

export const Route = createFileRoute('/')({
  component: TimerPage,
});

function TimerPage() {
  const { settings } = useSettings();
  const { addSession, todaySeconds, recentTasks } = useSessions();
  const [task, setTask] = useState<string>(() => loadLastTask());

  const handleComplete = useCallback(
    (mode: TimerMode, durationSeconds: number) => {
      if (mode === 'focus') {
        addSession({ task: task.trim() || 'Untitled', mode, durationSeconds });
      }
      if (settings.soundOnComplete) playChime();
      showNotification(
        mode === 'focus' ? 'Focus session complete' : 'Break over',
        mode === 'focus' ? 'Nice work — time for a break.' : 'Back to it when you are ready.',
      );
    },
    [addSession, task, settings.soundOnComplete],
  );

  const timer = useTimer({ settings, onComplete: handleComplete });
  const theme = MODE_THEMES[timer.mode];

  useEffect(() => {
    saveLastTask(task);
  }, [task]);

  useEffect(() => {
    setTabTitle(
      timer.isRunning
        ? `${formatClock(timer.remaining)} · ${MODE_LABELS[timer.mode]}`
        : 'Pomodoro Timer',
    );
  }, [timer.isRunning, timer.remaining, timer.mode]);

  const sessionIndex = (timer.completedInCycle % settings.sessionsBeforeLongBreak) + 1;

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <TaskInput
        value={task}
        onChange={setTask}
        recentTasks={recentTasks}
        locked={timer.isRunning && timer.mode === 'focus'}
      />

      <ModeTabs mode={timer.mode} onChange={timer.switchMode} />

      <TimerDisplay
        mode={timer.mode}
        remaining={timer.remaining}
        progress={timer.progress}
        isRunning={timer.isRunning}
        sessionIndex={sessionIndex}
        sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
      />

      <TimerControls
        mode={timer.mode}
        isRunning={timer.isRunning}
        canStart={timer.mode !== 'focus' || task.trim().length > 0}
        onToggle={timer.toggle}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      <Link to="/stats" className="text-sm text-slate-400 transition hover:text-slate-200">
        Focused <span className="font-semibold text-slate-200">{formatDuration(todaySeconds)}</span>{' '}
        today · see stats →
      </Link>
    </div>
  );
}
