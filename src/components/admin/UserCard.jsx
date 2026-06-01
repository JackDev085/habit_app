import EvaluationSummary from "./EvaluationSummary";

export default function UserCard({ user, evaluation, onOpenDash }) {
  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-800 transition duration-300 flex flex-col justify-between shadow-md">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-4 mb-4">
        <div>
          <p className="text-base font-bold text-white tracking-tight">
            {user.name}{" "}
            <span className="text-zinc-500 font-medium text-xs font-mono block sm:inline sm:ml-1">
              (@{user.username})
            </span>
          </p>
          {user.position && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold text-zinc-400">
              {user.position}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenDash}
          className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 rounded-xl transition-all duration-200 hover:scale-[1.05]"
          title="Ver Histórico Completo de Carga"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 00-2 2z" />
          </svg>
        </button>
      </div>

      <div className="mt-1">
        <EvaluationSummary evaluation={evaluation} />
      </div>
    </div>
  );
}
