import { useState, useMemo, useEffect } from "react";

export default function ManageMembersModal({
  open,
  onClose,
  allUsers,
  members,
  onAdd,
  onRemove,
  busyUserId,
}) {
  const [q, setQ] = useState("");

  const memberIds = useMemo(
    () => new Set((members ?? []).map((m) => m.id)),
    [members],
  );

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return allUsers ?? [];
    return (allUsers ?? []).filter((u) =>
      `${u.name ?? ""} ${u.username ?? ""}`.toLowerCase().includes(qq),
    );
  }, [q, allUsers]);

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl glass-panel border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-950 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Gerenciar Membros
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Vincule ou remova atletas deste grupo de treino.
            </p>
          </div>
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

        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar atleta por nome ou usuário..."
            className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
          />
        </div>

        {/* Users List */}
        <div className="mt-4 max-h-[350px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {filtered.map((u) => {
            const isMember = memberIds.has(u.id);
            const busy = busyUserId === u.id;

            return (
              <div
                key={u.id}
                className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-800 transition"
              >
                <div className="min-w-0">
                  <p className="text-zinc-100 font-bold text-sm truncate">
                    {u.name}
                  </p>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">
                    @{u.username}
                  </p>
                </div>

                {isMember ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onRemove(u.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-red-950 text-red-400 hover:bg-red-950/20 transition text-xs font-bold uppercase tracking-wider disabled:opacity-60"
                  >
                    {busy ? "..." : "Remover"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onAdd(u.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold text-xs uppercase tracking-wider transition disabled:opacity-60"
                  >
                    {busy ? "..." : "Adicionar"}
                  </button>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-zinc-500 text-sm text-center py-10 bg-zinc-950/40 border border-dashed border-zinc-800 rounded-xl">
              Nenhum atleta encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
