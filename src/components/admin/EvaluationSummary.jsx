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

      {evaluation?.muscle_in_risk && (
        <div>
          <h4 className="text-xs uppercase tracking-wide text-neutral-400 mb-2 ">
            Músculos Dor Águda
          </h4>
          <div className="flex flex-col gap-2 w-fit">
            {Object.entries(evaluation?.muscle_in_risk ?? {}).map(
              ([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-1 text-xs rounded-sm bg-red-500 text-white"
                >
                  {key}:{value}
                </span>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
