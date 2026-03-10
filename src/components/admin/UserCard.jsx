import EvaluationSummary from "./EvaluationSummary";

export default function UserCard({ user, evaluation, onOpenDash }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-neutral-100">
            {user.name}{" "}
            <span className="text-neutral-400 font-normal">
              ({user.username}){" "}
            </span>
          </p>
          {user.sex && (
            <p className="text-sm text-neutral-500 mt-1">{user.sex}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenDash}
          className="p-2 hover:bg-neutral-800 rounded-xl transition border border-neutral-800"
          title="Abrir dashboard do usuário"
        >
          <img src="/grafico.svg" className="w-6" alt="dash" />
        </button>
      </div>

      <div className="mt-5">
        <EvaluationSummary evaluation={evaluation} />
      </div>
    </div>
  );
}
