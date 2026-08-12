import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const linkBase =
  'rounded-full px-4 py-1.5 text-sm font-medium text-neutral-500 transition hover:text-neutral-100';
const linkActive = 'bg-white/10 text-white';

function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0) 75%)',
        }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-12 sm:px-6">
        <header className="flex items-center justify-between gap-3 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <span className="h-2 w-2 rounded-full bg-neutral-200" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-neutral-200">Pomodoro</span>
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
