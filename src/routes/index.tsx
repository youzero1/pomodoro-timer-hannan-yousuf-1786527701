import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <p className="text-sm tracking-widest uppercase text-slate-400">Pomodoro timer</p>
    </div>
  );
}
