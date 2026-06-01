import { useState, useEffect } from "react";

export default function GroupFormModal({
  open,
  mode,
  initialValue,
  onClose,
  onSubmit,
  loading,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(initialValue?.name ?? "");
  }, [initialValue]);

  if (!open) return null;

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md glass-panel border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-950 pb-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            {isEdit ? "Editar Grupo" : "Criar Novo Grupo"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg transition"
            aria-label="Fechar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="mt-5">
          <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-2">
            Nome do Grupo
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
            placeholder="Ex: Sub-17 Masculino"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition text-xs font-bold uppercase tracking-wider"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ name })}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !name.trim()}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
