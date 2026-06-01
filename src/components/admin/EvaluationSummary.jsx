import MetricChips from "./MetricChips";

export default function EvaluationSummary({ evaluation }) {
  const pre = evaluation?.pre ?? null;
  const pos = evaluation?.pos ?? null;

  return (
    <div className="space-y-4">
      
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          Pré-Treino (Entrada)
        </h4>
        <MetricChips obj={pre} />
      </div>

      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          Pós-Treino (Desgaste)
        </h4>
        <MetricChips obj={pos} />
      </div>

      {evaluation?.muscle_in_risk && Object.keys(evaluation.muscle_in_risk).length > 0 && (
        <div className="pt-2 border-t border-zinc-900">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Zonas de Dor Aguda (Atenção)
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(evaluation.muscle_in_risk).map(([key, value]) => (
              <span
                key={key}
                className="px-2.5 py-1 text-xs rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 font-semibold"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}
