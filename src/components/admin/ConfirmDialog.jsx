export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  loading,
  confirmText = "Excluir",
  confirmLoadingText = "Excluindo...",
  confirmColor = "red",
}) {
  if (!open) return null;

  const colorClasses = {
    red: "bg-red-600 hover:bg-red-500",
    blue: "bg-blue-600 hover:bg-blue-500",
    green: "bg-green-600 hover:bg-green-500",
  };

  const btnClass = colorClasses[confirmColor] || colorClasses.red;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
        <p className="text-neutral-400 text-sm mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-900 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl transition font-semibold ${btnClass}`}
            disabled={loading}
          >
            {loading ? confirmLoadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
