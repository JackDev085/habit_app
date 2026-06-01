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
    <div className="glass-panel border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
          Grupos de Treino
        </h2>
        <button
          type="button"
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
        >
          + Novo Grupo
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <img src="/spin.svg" className="w-8 h-8 animate-spin invert opacity-60" alt="loading" />
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Carregando grupos...</span>
        </div>
      ) : (
        <ul className="space-y-3">
          {(groups ?? []).map((g) => {
            const active = g.id === selectedGroupId;
            return (
              <li key={g.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(g.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(g.id);
                  }}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer
                    ${
                      active
                        ? "bg-zinc-900 border-emerald-500/40 shadow-md shadow-emerald-500/5"
                        : "bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                >
                  <div className="text-left">
                    <p className={`font-bold transition-colors ${active ? "text-emerald-400" : "text-zinc-100"}`}>{g.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {g.id}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(g);
                      }}
                      className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                      title="Editar Grupo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(g);
                      }}
                      className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-950 transition"
                      title="Excluir Grupo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendEmail(g);
                      }}
                      className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-950 transition"
                      title="Enviar Lembretes"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}

          {(groups ?? []).length === 0 && (
            <div className="text-zinc-500 text-sm text-center py-10 bg-zinc-950/40 border border-dashed border-zinc-800 rounded-xl">
              Nenhum grupo cadastrado
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
