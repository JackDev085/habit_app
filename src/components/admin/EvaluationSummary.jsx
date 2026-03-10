import MetricChips from "./MetricChips";
export default function EvaluationSummary({ evaluation }) {
  const pre = evaluation?.pre ?? null;
  const pos = evaluation?.pos ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
          Pré-treino
        </h4>
        <MetricChips obj={pre} />
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
          Pós-treino
        </h4>
        <MetricChips obj={pos} />
      </div>
    </div>
  );
}
