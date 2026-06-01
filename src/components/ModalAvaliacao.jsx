import { useState } from "react";
import { toast } from "react-toastify";
import InputAvaliacao from "./InputAvaliacao";
import api from "../../api/api";

export default function ModalAvaliacao({ isOpen, onClose, pos = false }) {
  const [form, setForm] = useState({
    sleep: 1,
    food: 1,
    pain: 1,
    workout: "",
    fadigue: 1,
    effort: 1,
    severe_pain: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dorForte, setDorForte] = useState(false);

  if (!isOpen) return null;

  // CONTROLE DE INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handleChange:", name, value);

    const newValue = ["sleep", "food", "pain", "fadigue", "effort"].includes(name)
      ? parseInt(value)
      : value;

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dados = { ...form, type: pos ? "pos" : "pre" };

      if (pos) {
        await api.post("/create/pos", dados);
      } else {
        await api.post("/create/pre", dados);
      }

      toast.success("Avaliação enviada com sucesso!");
      onClose();
    } catch (err) {
      let erro = err?.response?.data?.detail || "Erro inesperado.";
      setError(erro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-zinc-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-2xl font-black text-emerald-400 mb-6 text-center uppercase tracking-tight">
          {pos ? "Avaliação Pós-Treino" : "Avaliação Pré-Treino"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* CAMPOS DINÂMICOS */}
          {pos ? (
            <>
              <InputAvaliacao title="Tipo de treino" handleChange={handleChange} form={form} field="workout" />
              <InputAvaliacao title="Fadiga" handleChange={handleChange} form={form} field="fadigue" />
              <InputAvaliacao title="Dor Muscular" handleChange={handleChange} form={form} field="pain" />
              <InputAvaliacao title="Percepção de esforço" handleChange={handleChange} form={form} field="effort" />

              {/* Seleção Dor Forte */}
              <div className="text-center mt-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-900">
                <p className="text-sm font-semibold text-zinc-300 mb-3">Você está com dor forte?</p>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setDorForte(true)}
                    className={`px-6 py-2 rounded-lg border transition font-bold text-xs uppercase tracking-wider
                      ${dorForte ? "bg-emerald-500 text-black border-emerald-500" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"}`}
                  >
                    Sim
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDorForte(false);
                      setForm({ ...form, severe_pain: "" });
                    }}
                    className={`px-6 py-2 rounded-lg border transition font-bold text-xs uppercase tracking-wider
                      ${!dorForte ? "bg-emerald-500 text-black border-emerald-500" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"}`}
                  >
                    Não
                  </button>
                </div>
              </div>

              {dorForte && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Região da Dor</label>
                  <select
                    name="severe_pain"
                    className="w-full bg-zinc-950 text-zinc-200 border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={form.severe_pain}
                    onChange={handleChange}
                    required={dorForte}
                  >
                    <option value="">Selecione a região dolorida</option>
                    {[
                      "Ombro Esquerdo", "Ombro Direito", "Ombros (Ambos)",
                      "Joelho Esquerdo", "Joelho Direito", "Joelhos (Ambos)",
                      "Tornozelo Esquerdo", "Tornozelo Direito", "Tornozelos (Ambos)",
                      "Coluna Lombar", "Coluna Cervical", "Quadril", "Pulso", "Cabeça", "Outro",
                    ].map((parte, i) => (
                      <option key={i} value={parte}>{parte}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              <InputAvaliacao title="Sono" handleChange={handleChange} form={form} field="sleep" />
              <InputAvaliacao title="Alimentação" handleChange={handleChange} form={form} field="food" />
              <InputAvaliacao title="Dor Muscular" handleChange={handleChange} form={form} field="pain" />
            </>
          )}

          {/* ERRO */}
          {error && (
            <p className="text-red-400 text-sm text-center font-medium mt-2">{error}</p>
          )}

          {/* BOTÕES */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-950">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition text-xs font-bold uppercase tracking-wider"
              onClick={onClose}
            >
              Fechar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider
              transition shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
