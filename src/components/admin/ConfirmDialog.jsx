export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  loading,
  confirmText = "Confirmar",
  confirmLoadingText = "Processando...",
  confirmColor = "red",
}) {
  if (!open) return null;

  const colorClasses = {
    red: "bg-red-500 hover:bg-red-400 text-black font-extrabold",
    blue: "bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold",
    green: "bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold",
  };

  const btnClass = colorClasses[confirmColor] || colorClasses.red;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md glass-panel border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
        <p className="text-zinc-400 text-sm mt-2 font-medium leading-relaxed">{description}</p>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-950">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition text-xs font-bold uppercase tracking-wider"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}
            disabled={loading}
          >
            {loading ? confirmLoadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
