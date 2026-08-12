---
status: implemented
title: Pomodoro Timer with Daily Focus Stats
---

## Product summary

A focused pomodoro app with two screens: a **Timer** screen and a **Stats** screen.

- Before starting a focus session the user types (or reuses) a task name.
- Timer cycles Focus → Short Break → Long Break, with lengths configurable in a settings panel.
- Every completed focus session is recorded locally with its task name, duration and finish time.
- The Stats screen shows **total focus time per day**: today's total, a 7-day bar chart, and a per-day breakdown.
- All data persists in the browser so it survives refreshes. No backend needed.

---

## Implementation steps

1. **Set up the stylesheet** — `src/styles/global.css`
   Ensure the file contains only the Tailwind import at the top, then define app theme tokens (a deep neutral background, a focus accent colour, a break accent colour, a long-break accent colour, plus a monospace-friendly display font stack).
   *Outcome:* Tailwind utilities work everywhere and mode colours are available as reusable tokens.

2. **Confirm the entry point** — `src/main.tsx`
   The stylesheet must be imported exactly once here, and the router mounted from the generated route tree.
   *Outcome:* App boots with styles applied and routing active.

3. **Define shared types** — `src/types/pomodoro.ts`
   Types for: timer mode (`focus` | `shortBreak` | `longBreak`), a settings object (focus minutes, short break minutes, long break minutes, sessions before a long break, auto-start next session flag, sound-on-complete flag), and a completed session record (id, task name, mode, duration in seconds, ISO completion timestamp).
   *Outcome:* One source of truth for data shapes used by hooks, components and stats.

4. **Local persistence helpers** — `src/lib/storage.ts`
   Typed read/write helpers over `localStorage` with namespaced keys for settings, session history and the last-used task name. Reads must tolerate missing/corrupt data by falling back to defaults.
   *Outcome:* Data survives reload and never crashes the app on bad stored values.

5. **Time and aggregation utilities** — `src/lib/time.ts`
   Functions to: format seconds as `MM:SS`; format a minutes total as a human string like `1h 25m`; produce a local `YYYY-MM-DD` day key from a timestamp; build the list of the last N day keys; and reduce session records into total focus seconds per day key.
   *Outcome:* Reusable, testable logic that both the timer display and the stats charts rely on.

6. **Settings state hook** — `src/hooks/useSettings.ts`
   Loads settings from storage on mount, exposes the current settings plus an update function and a reset-to-defaults function, and writes back on every change. Defaults are the classic 25 / 5 / 15 with 4 sessions before a long break.
   *Outcome:* Any component can read and change durations, with changes saved automatically.

7. **Session history hook** — `src/hooks/useSessions.ts`
   Loads recorded sessions from storage, exposes the session list, an "add completed session" function, a "clear all history" function, and derived values: today's total focus seconds, the current daily streak, and totals per day for the last 7 days.
   *Outcome:* A single hook powers every number shown on the Stats screen.

8. **Countdown timer hook** — `src/hooks/useTimer.ts`
   A drift-free countdown driven by comparing a target end timestamp against the current time on an interval (not by decrementing a counter). Exposes: current mode, seconds remaining, running/paused state, completed-focus-count within the current cycle, and actions for start, pause, resume, reset, and skip-to-next. On reaching zero it fires a completion callback, then advances to the next mode following the long-break interval rule, and auto-starts only if that setting is enabled.
   *Outcome:* Accurate timing even when the tab is backgrounded or throttled.

9. **Circular timer display** — `src/components/TimerDisplay.tsx`
   Large `MM:SS` readout inside an SVG progress ring that depletes as time passes. Ring and text colour follow the active mode. Includes a small mode label and the "session X of N" cycle indicator.
   *Outcome:* The clear visual centrepiece of the timer screen.

10. **Mode switcher** — `src/components/ModeTabs.tsx`
    Three pill-style tabs (Focus, Short Break, Long Break) that let the user jump modes manually; switching resets the countdown to that mode's configured length and highlights the active tab in that mode's colour.
    *Outcome:* Manual control over which phase is running.

11. **Timer controls** — `src/components/TimerControls.tsx`
    Primary Start/Pause button plus secondary Reset and Skip buttons, with clear disabled states (e.g. Start blocked in focus mode until a task name exists) and keyboard focus styling.
    *Outcome:* All timer actions reachable in one row under the clock.

12. **Task name field** — `src/components/TaskInput.tsx`
    A text input shown above the timer for "What are you working on?", pre-filled with the last used task name and offering quick-pick chips of recently used task names pulled from session history. Locked (read-only) while a focus session is running.
    *Outcome:* Every focus session is attributed to a named task.

13. **Settings panel** — `src/components/SettingsPanel.tsx`
    A slide-over/modal opened from a gear icon, containing number inputs (with sensible min/max clamping) for focus, short break and long break minutes, sessions before long break, plus toggles for auto-start next session and completion sound. Includes Save/Reset-to-defaults actions and closes on backdrop click or Escape.
    *Outcome:* Users tailor session lengths without touching the timer flow.

14. **Stats summary cards** — `src/components/StatsSummary.tsx`
    Three cards: focus time today, focus time this week, and current daily streak — each with a large value, a label, and a subtle comparison line (e.g. vs. yesterday).
    *Outcome:* Immediate at-a-glance progress.

15. **Daily focus bar chart** — `src/components/DailyFocusChart.tsx`
    A pure-CSS/flex bar chart of the last 7 days of total focus time, bars scaled to the week's maximum, day-of-week labels beneath, hover/tap tooltip showing the exact total, and a friendly empty state when there is no data yet.
    *Outcome:* The core "total focus time per day" visualisation, with no charting dependency.

16. **Session history list** — `src/components/SessionList.tsx`
    Sessions grouped under day headings (Today, Yesterday, then dates), each row showing task name, duration and completion time, with a per-day subtotal on the heading row and a "Clear history" action guarded by a confirmation.
    *Outcome:* Users can review and reset what was recorded.

17. **App shell and navigation** — `src/routes/__root.tsx`
    Centered max-width layout on the themed background, a slim header with the app name and links to Timer and Stats (active link highlighted), the settings gear button, and the page outlet below.
    *Outcome:* Consistent chrome and easy movement between the two screens.

18. **Timer screen** — `src/routes/index.tsx`
    Composes the task input, mode tabs, timer display and controls; wires the timer hook's completion callback to record a session (focus completions only) into the session history hook; shows a compact "focus today" line at the bottom linking to Stats.
    *Outcome:* The default screen is a fully working pomodoro timer that logs its results.

19. **Stats screen** — `src/routes/stats.tsx`
    Stacks the summary cards, the 7-day chart and the session history list, with an empty state inviting the user to run their first session.
    *Outcome:* A dedicated page answering "how much did I focus each day?".

20. **Completion feedback** — `src/lib/notify.ts` plus wiring in `src/routes/index.tsx`
    On session completion: update the browser tab title with the remaining time while running, play a short generated tone via the Web Audio API when the sound setting is on, and request/show a desktop notification if permission is granted (silently skipped otherwise).
    *Outcome:* The user notices the session ended even in another tab.

21. **Responsive and accessibility pass** — across `src/components/` and `src/routes/`
    Verify the layout works from 360px up to desktop, the timer ring scales, controls stack on small screens, all interactive elements have accessible labels, and the countdown is announced politely to screen readers at mode changes rather than every second.
    *Outcome:* Usable and accessible on phone and desktop.

22. **Final verification**
    Run through: set custom durations → start a named focus session → let it complete → confirm it appears in today's total, the 7-day chart and the history list → refresh the page and confirm settings and history persisted.
    *Outcome:* End-to-end confidence the app behaves as described.
