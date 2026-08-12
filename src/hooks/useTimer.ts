import { useCallback, useEffect, useRef, useState } from 'react';
import type { Settings, TimerMode } from '@/types/pomodoro';

export function modeDurationSeconds(mode: TimerMode, settings: Settings): number {
  switch (mode) {
    case 'focus':
      return settings.focusMinutes * 60;
    case 'shortBreak':
      return settings.shortBreakMinutes * 60;
    case 'longBreak':
      return settings.longBreakMinutes * 60;
  }
}

interface UseTimerOptions {
  settings: Settings;
  onComplete: (mode: TimerMode, durationSeconds: number) => void;
}

export function useTimer({ settings, onComplete }: UseTimerOptions) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(() => modeDurationSeconds('focus', settings));
  const [completedInCycle, setCompletedInCycle] = useState(0);

  const endAtRef = useRef<number | null>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const cycleRef = useRef(completedInCycle);
  cycleRef.current = completedInCycle;

  const total = modeDurationSeconds(mode, settings);

  // Keep the displayed time in sync when durations change while idle.
  useEffect(() => {
    if (!isRunning && endAtRef.current === null) {
      setRemaining(modeDurationSeconds(modeRef.current, settings));
    }
  }, [settings, isRunning]);

  const finish = useCallback(() => {
    const finishedMode = modeRef.current;
    const s = settingsRef.current;
    const duration = modeDurationSeconds(finishedMode, s);

    endAtRef.current = null;
    setIsRunning(false);
    completeRef.current(finishedMode, duration);

    let nextMode: TimerMode;
    let nextCycle = cycleRef.current;
    if (finishedMode === 'focus') {
      nextCycle = cycleRef.current + 1;
      nextMode = nextCycle % s.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
    } else {
      nextMode = 'focus';
    }

    setCompletedInCycle(nextCycle);
    cycleRef.current = nextCycle;
    modeRef.current = nextMode;
    setMode(nextMode);

    const nextDuration = modeDurationSeconds(nextMode, s);
    setRemaining(nextDuration);

    if (s.autoStartNext) {
      endAtRef.current = Date.now() + nextDuration * 1000;
      setIsRunning(true);
    }
  }, []);

  // Drift-free tick: compare against a target timestamp.
  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      const endAt = endAtRef.current;
      if (endAt === null) return;
      const left = Math.round((endAt - Date.now()) / 1000);
      if (left <= 0) {
        setRemaining(0);
        finish();
      } else {
        setRemaining(left);
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [isRunning, finish]);

  const start = useCallback(() => {
    const seconds = remaining > 0 ? remaining : modeDurationSeconds(modeRef.current, settingsRef.current);
    endAtRef.current = Date.now() + seconds * 1000;
    setRemaining(seconds);
    setIsRunning(true);
  }, [remaining]);

  const pause = useCallback(() => {
    const endAt = endAtRef.current;
    if (endAt !== null) {
      setRemaining(Math.max(0, Math.round((endAt - Date.now()) / 1000)));
    }
    endAtRef.current = null;
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) pause();
    else start();
  }, [isRunning, pause, start]);

  const reset = useCallback(() => {
    endAtRef.current = null;
    setIsRunning(false);
    setRemaining(modeDurationSeconds(modeRef.current, settingsRef.current));
  }, []);

  const switchMode = useCallback((next: TimerMode) => {
    endAtRef.current = null;
    setIsRunning(false);
    modeRef.current = next;
    setMode(next);
    setRemaining(modeDurationSeconds(next, settingsRef.current));
  }, []);

  /** Move to the next phase without recording the current one. */
  const skip = useCallback(() => {
    const s = settingsRef.current;
    const finishedMode = modeRef.current;
    let nextMode: TimerMode;
    if (finishedMode === 'focus') {
      const nextCycle = cycleRef.current + 1;
      nextMode = nextCycle % s.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
    } else {
      nextMode = 'focus';
    }
    switchMode(nextMode);
  }, [switchMode]);

  return {
    mode,
    remaining,
    total,
    isRunning,
    completedInCycle,
    progress: total > 0 ? 1 - remaining / total : 0,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
  };
}
