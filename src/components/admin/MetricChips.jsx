import { useMemo } from "react";
export default function MetricChips({ obj }) {
  const entries = useMemo(() => Object.entries(obj ?? {}), [obj]);

  if (!entries.length)
    return <p className="text-neutral-500 text-sm">Sem dados</p>;

  return (
    <ul className="flex flex-wrap gap-3">
      {entries.map(([key, val]) => {
        const n = Number(val);
        const inverted = ["pain", "pain_pos", "fadigue"].includes(key);

        let color = "text-gray-400"; // fallback

        if (!Number.isFinite(n)) {
          color = "text-gray-400";
        }
        // 1 até 2 (2 é BOM)
        else if (n >= 1 && n <= 2) {
          color = inverted ? "text-green-400" : "text-red-400";
        }
        // maior que 2 até 3 (3 é MÉDIO)
        else if (n > 2 && n <= 3) {
          color = "text-yellow-400";
        }
        // maior que 3 até 5
        else if (n > 3 && n <= 5) {
          color = inverted ? "text-red-400" : "text-green-400";
        }

        return (
          <li
            key={key}
            className={`bg-neutral-800 px-4 py-2 rounded-lg text-center ${color}`}
          >
            <span className="uppercase text-xs tracking-wide block text-neutral-400">
              {key}
            </span>
            <span className="font-bold text-lg">{val}</span>
          </li>
        );
      })}
    </ul>
  );
}
