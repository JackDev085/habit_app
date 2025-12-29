import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MeuGrafico({ avaliacao, pos }) {
  if (!avaliacao || avaliacao.length === 0) {
    return (
      <p className="text-center text-gray-400">
        Nenhuma avaliação {pos ? "pós treino" : "pré treino"} enviada.
      </p>
    );
  }

  const campos = pos
    ? [
        { nome: "effort", label: "Esforço" },
        { nome: "fadigue", label: "Fadiga" },
        { nome: "pain", label: "Dor Pós" },
      ]
    : [
        { nome: "sleep", label: "Sono" },
        { nome: "food", label: "Alimentação" },
        { nome: "pain", label: "Dor" },
      ];

  const gerarData = (campo) =>
    avaliacao.map((aval) => ({
      name: aval.data?.substring(0, 5) || "??",
      valor: aval[campo] ?? 0,
    }));

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg">
      <h2 className="font-semibold text-xl text-center text-green-400 mb-4">
        Autoavaliações {pos ? "Pós-treino" : "Pré-treino"}
      </h2>

      {campos.map((campo) => (
        <div
          key={campo.nome}
          className="bg-neutral-800 rounded-lg p-3 my-4 shadow-inner"
        >
          <h3 className="text-center text-gray-200 font-medium">
            {campo.label}
          </h3>

          <div className="flex justify-center">
            <LineChart
              width={330}
              height={200}
              data={gerarData(campo.nome)}
              className="mt-3"
            >
              <XAxis
                dataKey="name"
                stroke="#aaa"
                tick={{ fill: "#bbb", fontSize: 12 }}
              />
              <YAxis stroke="#888" tick={{ fill: "#bbb", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <CartesianGrid stroke="#333" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#5B8CFF"
                strokeWidth={2}
                dot={{ r: 3, fill: "#5B8CFF" }}
              />
            </LineChart>
          </div>
        </div>
      ))}
    </div>
  );
}
