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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-100">
            {isEdit ? "Editar grupo" : "Criar grupo"}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200"
          >
            ✕
          </button>
        </div>

        <label className="block mt-5 text-sm text-neutral-300">
          Nome do grupo
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 outline-none focus:border-green-500"
            placeholder="Ex: Sub-17 Masculino"
          />
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-900 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ name })}
            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold"
            disabled={loading || !name.trim()}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
