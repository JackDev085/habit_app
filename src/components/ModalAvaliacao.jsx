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

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acess_token") || ""}`,
        },
      };

      if(pos){
        await api.post("/create/pos", dados, config);
      } else{
        await api.post("/create/pre", dados, config);
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 w-full max-w-lg rounded-xl p-6 border border-neutral-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
          {pos ? "Avaliação Pós-Treino" : "Avaliação Pré-Treino"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CAMPOS DINÂMICOS */}
          {pos ? (
            <>
              <InputAvaliacao title="Tipo de treino" handleChange={handleChange} form={form} field="treino" />
              <InputAvaliacao title="Fadiga" handleChange={handleChange} form={form} field="fadiga" />
              <InputAvaliacao title="Dor" handleChange={handleChange} form={form} field="dor" />
              <InputAvaliacao title="Percepção de esforço" handleChange={handleChange} form={form} field="esforco" />

              {/* Seleção Dor Forte */}
              <div className="text-center mt-4">
                <p className="text-neutral-300 mb-2">Você está com dor forte?</p>
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setDorForte(true)}
                    className={`px-4 py-2 rounded-lg border transition 
                      ${dorForte ? "bg-green-500 text-black" : "bg-neutral-800 text-neutral-300"}`}
                  >
                    Sim
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDorForte(false);
                      setForm({ ...form, severe_pain: "" });
                    }}
                    className={`px-4 py-2 rounded-lg border transition 
                      ${!dorForte ? "bg-green-500 text-black" : "bg-neutral-800 text-neutral-300"}`}
                  >
                    Não
                  </button>
                </div>
              </div>

              {dorForte && (
                <select
                  name="dorForte"
                  className="w-full bg-neutral-800 text-neutral-200 border border-neutral-700 p-3 rounded-lg"
                  value={form.severe_pain}
                  onChange={handleChange}
                  required
                >
                  <option value="">Onde está a dor?</option>
                  {[
                    "Ombro Esquerdo", "Ombro Direito", "Ombros (Ambos)",
                    "Joelho Esquerdo", "Joelho Direito", "Joelhos (Ambos)",
                    "Tornozelo Esquerdo", "Tornozelo Direito", "Tornozelos (Ambos)",
                    "Coluna Lombar", "Coluna Cervical", "Quadril", "Pulso", "Cabeça", "Outro",
                  ].map((parte, i) => (
                    <option key={i} value={parte}>{parte}</option>
                  ))}
                </select>
              )}
            </>
          ) : (
            <>
              <InputAvaliacao title="Sono" handleChange={handleChange} form={form} field="sleep" />
              <InputAvaliacao title="Alimentação" handleChange={handleChange} form={form} field="food" />
              <InputAvaliacao title="Dor" handleChange={handleChange} form={form} field="pain" />
            </>
          )}

          {/* ERRO */}
          {error && (
            <p className="text-red-400 text-sm text-center mt-2">{error}</p>
          )}

          {/* BOTÕES */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
              onClick={onClose}
            >
              Fechar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 
              transition disabled:bg-green-800 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
