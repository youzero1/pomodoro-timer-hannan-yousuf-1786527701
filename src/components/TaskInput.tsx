interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  recentTasks: string[];
  locked: boolean;
}

export function TaskInput({ value, onChange, recentTasks, locked }: TaskInputProps) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="task" className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">
        What are you working on?
      </label>
      <input
        id="task"
        value={value}
        readOnly={locked}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Write project brief"
        maxLength={80}
        className={`w-full rounded-xl border px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition ${
          locked
            ? 'cursor-default border-white/5 bg-white/[0.03] text-slate-300'
            : 'border-white/10 bg-white/5 focus:border-white/30 focus:bg-white/10'
        }`}
      />

      {!locked && recentTasks.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {recentTasks.map((task) => (
            <button
              key={task}
              onClick={() => onChange(task)}
              className="max-w-full truncate rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              {task}
            </button>
          ))}
        </div>
      )}

      {locked && (
        <p className="mt-2 text-xs text-slate-500">Locked while this session runs.</p>
      )}
    </div>
  );
}
