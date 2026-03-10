export default function GroupsPanel({
  groups,
  selectedGroupId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
  loading,
  onSendEmail,
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-wide text-neutral-400">
          Grupos
        </h2>
        <button
          type="button"
          onClick={onCreate}
          className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold text-sm"
        >
          + Criar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <img src="/spin.svg" className="w-10 invert" alt="loading" />
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {(groups ?? []).map((g) => {
            const active = g.id === selectedGroupId;
            return (
              <li key={g.id}>
                <span
                  onClick={() => onSelect(g.id)}
                  className={`w-full p-4 rounded-xl border transition flex items-center justify-between gap-3
                    ${
                      active
                        ? "bg-neutral-800 border-green-500/50"
                        : "bg-neutral-950 border-neutral-800 hover:bg-neutral-800"
                    }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-neutral-100">{g.name}</p>
                    <p className="text-xs text-neutral-500">ID: {g.id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(g);
                      }}
                      className="p-2 rounded-lg hover:bg-neutral-700 transition border"
                      title="Editar"
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(g);
                      }}
                      className="p-2 rounded-lg hover:bg-neutral-700 transition border"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendEmail(g);
                      }}
                      className="p-2 rounded-lg hover:bg-neutral-700 transition border"
                      title="Enviar"
                    >
                      📩
                    </button>
                  </div>
                </span>
              </li>
            );
          })}

          {(groups ?? []).length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-6">
              Nenhum grupo cadastrado
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
