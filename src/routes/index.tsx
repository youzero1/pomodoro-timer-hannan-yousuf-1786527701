import { useCallback, useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { TimerDisplay } from '@/components/TimerDisplay';
import { ModeTabs } from '@/components/ModeTabs';
import { TimerControls } from '@/components/TimerControls';
import { TaskInput } from '@/components/TaskInput';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useSettings } from '@/hooks/useSettings';
import { useSessions } from '@/hooks/useSessions';
import { useTimer } from '@/hooks/useTimer';
import { MODE_LABELS, type TimerMode } from '@/types/pomodoro';
import { formatClock, formatDuration } from '@/lib/time';
import { loadLastTask, saveLastTask } from '@/lib/storage';
import {
  playChime,
  requestNotificationPermission,
  setTabTitle,
  showNotification,
} from '@/lib/notify';

export const Route = createFileRoute('/')({
  component: TimerPage,
});

function TimerPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { addSession, todaySeconds, recentTasks } = useSessions();
  const [task, setTask] = useState<string>(() => loadLastTask());
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const handleToggle = useCallback(() => {
    if (!timer.isRunning) requestNotificationPermission();
    timer.toggle();
  }, [timer]);

  const sessionIndex = (timer.completedInCycle % settings.sessionsBeforeLongBreak) + 1;

  return (
    <div className="flex flex-col items-center gap-7 py-2 sm:gap-8 sm:py-4">
      <TaskInput
        value={task}
        onChange={setTask}
        recentTasks={recentTasks}
        locked={timer.isRunning && timer.mode === 'focus'}
      />

      <div className="flex items-center gap-2">
        <ModeTabs mode={timer.mode} onChange={timer.switchMode} />
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition hover:bg-white/10 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

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
        onToggle={handleToggle}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      <Link to="/stats" className="text-sm text-neutral-400 transition hover:text-neutral-200">
        Focused <span className="font-semibold text-neutral-200">{formatDuration(todaySeconds)}</span>{' '}
        today · see stats →
      </Link>

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onChange={updateSettings}
        onReset={resetSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
