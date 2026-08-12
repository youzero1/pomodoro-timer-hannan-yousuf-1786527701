import { useEffect } from 'react';
import type { Settings } from '@/types/pomodoro';

interface SettingsPanelProps {
  open: boolean;
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onClose: () => void;
}

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  step?: number;
  onChange: (value: number) => void;
}

function NumberField({ label, value, min, max, suffix, step = 1, onChange }: NumberFieldProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-neutral-300">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(clamp(value - step))}
          aria-label={`Decrease ${label}`}
          className="h-8 w-8 rounded-lg border border-white/10 text-neutral-300 transition hover:bg-white/10"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          aria-label={label}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(clamp(Math.round(n)));
          }}
          className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm text-[#7df9ff] outline-none focus:border-[#00f0ff]/60"
        />
        <button
          onClick={() => onChange(clamp(value + step))}
          aria-label={`Increase ${label}`}
          className="h-8 w-8 rounded-lg border border-white/10 text-neutral-300 transition hover:bg-white/10"
        >
          +
        </button>
        <span className="w-8 text-xs text-neutral-500">{suffix}</span>
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm text-neutral-300">{label}</span>
        <span className="block text-xs text-neutral-500">{description}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? 'bg-[#00f0ff] shadow-[0_0_18px_-2px_rgba(0,240,255,0.9)]'
            : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
            checked ? 'left-[22px] bg-black' : 'left-0.5 bg-neutral-300'
          }`}
        />
      </span>
    </button>
  );
}

export function SettingsPanel({ open, settings, onChange, onReset, onClose }: SettingsPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Timer settings"
        className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-neutral-950 p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-full px-2 py-1 text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="divide-y divide-white/5">
          <NumberField
            label="Focus length"
            value={settings.focusMinutes}
            min={1}
            max={180}
            suffix="min"
            onChange={(v) => onChange({ focusMinutes: v })}
          />
          <NumberField
            label="Short break"
            value={settings.shortBreakMinutes}
            min={1}
            max={60}
            suffix="min"
            onChange={(v) => onChange({ shortBreakMinutes: v })}
          />
          <NumberField
            label="Long break"
            value={settings.longBreakMinutes}
            min={1}
            max={120}
            suffix="min"
            onChange={(v) => onChange({ longBreakMinutes: v })}
          />
          <NumberField
            label="Sessions before long break"
            value={settings.sessionsBeforeLongBreak}
            min={1}
            max={12}
            suffix=""
            onChange={(v) => onChange({ sessionsBeforeLongBreak: v })}
          />
          <NumberField
            label="Daily focus goal"
            value={settings.dailyGoalMinutes}
            min={0}
            max={960}
            step={15}
            suffix="min"
            onChange={(v) => onChange({ dailyGoalMinutes: v })}
          />
          <Toggle
            label="Auto-start next session"
            description="Roll straight into breaks and focus blocks."
            checked={settings.autoStartNext}
            onChange={(v) => onChange({ autoStartNext: v })}
          />
          <Toggle
            label="Play a sound when time is up"
            description="A short chime at the end of each session."
            checked={settings.soundOnComplete}
            onChange={(v) => onChange({ soundOnComplete: v })}
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={onReset}
            className="text-xs text-neutral-400 underline underline-offset-4 transition hover:text-neutral-200"
          >
            Reset to defaults
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-[#00f0ff] px-6 py-2 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(0,240,255,0.9)] transition hover:bg-[#5cf7ff]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
