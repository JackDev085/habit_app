import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const metricStyles = {
  sleep: { color: "#10b981", label: "Sono" },       // Emerald
  food: { color: "#06b6d4", label: "Alimentação" },   // Teal
  pain: { color: "#ef4444", label: "Dor" },          // Red
  effort: { color: "#10b981", label: "Esforço" },    // Emerald
  fadigue: { color: "#f59e0b", label: "Fadiga" },    // Amber
};

export default function MeuGrafico({ avaliacao, pos }) {
  if (!avaliacao || avaliacao.length === 0) {
    return (
      <div className="py-8 text-center text-zinc-500 font-medium">
        Nenhuma avaliação {pos ? "pós-treino" : "pré-treino"} registrada nesta semana.
      </div>
    );
  }

  const campos = pos
    ? [
        { nome: "effort", label: "Percepção de Esforço" },
        { nome: "fadigue", label: "Nível de Fadiga" },
        { nome: "pain", label: "Registro de Dor" },
      ]
    : [
        { nome: "sleep", label: "Qualidade do Sono" },
        { nome: "food", label: "Qualidade Alimentar" },
        { nome: "pain", label: "Registro de Dor" },
      ];

  const gerarData = (campo) =>
    avaliacao.map((aval) => ({
      name: aval.send_date ? aval.send_date.split(" ")[0] : "??", // Mostra só o dia/mes
      valor: aval[campo] ?? 0,
    }));

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-extrabold text-lg uppercase tracking-wider text-emerald-400 border-b border-zinc-800/80 pb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Autoavaliações {pos ? "Pós-treino" : "Pré-treino"}
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {campos.map((campo) => {
          const style = metricStyles[campo.nome] || { color: "#10b981" };
          const chartData = gerarData(campo.nome);

          return (
            <div
              key={campo.nome}
              className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-zinc-300 text-sm font-bold uppercase tracking-wider">
                  {campo.label}
                </h3>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: style.color }}
                />
              </div>

              <div className="w-full h-48 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#4b5563"
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#4b5563"
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      domain={[0, 5]}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#09090b",
                        border: "1px solid #1f2937",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: style.color }}
                    />
                    <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke={style.color}
                      strokeWidth={3}
                      dot={{ r: 4, fill: style.color, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: style.color, strokeWidth: 2, stroke: "#000" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
