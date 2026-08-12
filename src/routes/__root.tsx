import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const linkBase =
  'rounded-full px-4 py-1.5 text-sm font-medium text-neutral-500 transition hover:text-[#7df9ff]';
const linkActive =
  'bg-[#00f0ff]/15 text-[#7df9ff] shadow-[0_0_18px_-4px_rgba(0,240,255,0.8)]';

function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(60% 45% at 50% 0%, rgba(0,240,255,0.20) 0%, rgba(0,240,255,0.05) 45%, rgba(0,0,0,0) 75%), radial-gradient(55% 45% at 85% 100%, rgba(255,47,208,0.16) 0%, rgba(0,0,0,0) 70%), radial-gradient(50% 40% at 10% 85%, rgba(57,255,20,0.10) 0%, rgba(0,0,0,0) 70%)',
        }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-12 sm:px-6">
        <header className="flex items-center justify-between gap-3 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 shadow-[0_0_20px_-4px_rgba(0,240,255,0.8)]">
              <span className="h-2 w-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_1px_rgba(0,240,255,0.9)]" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-[#7df9ff] [text-shadow:0_0_16px_rgba(0,240,255,0.55)]">
              Pomodoro
            </span>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <Link to="/" className={linkBase} activeProps={{ className: `${linkBase} ${linkActive}` }}>
              Timer
            </Link>
            <Link
              to="/stats"
              className={linkBase}
              activeProps={{ className: `${linkBase} ${linkActive}` }}
            >
              Stats
            </Link>
          </nav>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg">This page does not exist.</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        Go to the timer
      </Link>
    </div>
  );
}
