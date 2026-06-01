import { useMemo } from "react";

const labelMap = {
  sleep: "Sono",
  food: "Nutrição",
  pain: "Dor",
  fadigue: "Fadiga",
  effort: "Esforço",
  workout: "Treino",
  severe_pain: "Dor Forte",
};

export default function MetricChips({ obj }) {
  const entries = useMemo(() => {
    // Filtra campos internos ou vazios
    return Object.entries(obj ?? {}).filter(
      ([key, val]) => val !== null && val !== "" && key !== "id" && key !== "user_id" && key !== "send_date"
    );
  }, [obj]);

  if (!entries.length)
    return <p className="text-zinc-500 text-xs italic">Sem registros para o dia</p>;

  return (
    <ul className="flex flex-wrap gap-2.5">
      {entries.map(([key, val]) => {
        const label = labelMap[key] || key;
        const n = Number(val);
        const inverted = ["pain", "pain_pos", "fadigue", "effort"].includes(key);

        let badgeStyle = "bg-zinc-900 border-zinc-800 text-zinc-400"; // fallback

        if (key === "severe_pain") {
          badgeStyle = "bg-red-950/40 border-red-500/20 text-red-400";
        } else if (key === "workout") {
          badgeStyle = "bg-blue-950/40 border-blue-500/20 text-blue-400";
        } else if (Number.isFinite(n)) {
          // BOM para bem-estar, RUIM para dor/fadiga/esforço/dor_pos
          if (n < 2.5) {
            badgeStyle = inverted
              ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
              : "bg-red-950/40 border-red-500/20 text-red-400";
          }
          // ALERTA / MÉDIO
          else if (n >= 2.5 && n < 3.5) {
            badgeStyle = "bg-amber-950/40 border-amber-500/20 text-amber-400";
          }
          // RUIM para bem-estar, BOM para dor/fadiga/esforço/dor_pos
          else {
            badgeStyle = inverted
              ? "bg-red-950/40 border-red-500/20 text-red-400"
              : "bg-emerald-950/40 border-emerald-500/20 text-emerald-400";
          }
        }

        return (
          <li
            key={key}
            className={`border px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold ${badgeStyle}`}
          >
            <span className="opacity-70 font-medium uppercase tracking-wider text-[10px]">{label}:</span>
            <span className="font-bold">{val}</span>
          </li>
        );
      })}
    </ul>
  );
}
