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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-100">
              Gerenciar membros
            </h3>
            <p className="text-sm text-neutral-500">
              Adicione ou remova usuários do grupo
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200"
          >
            ✕
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou username..."
          className="mt-4 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 outline-none focus:border-green-500"
        />

        <div className="mt-4 max-h-[420px] overflow-auto space-y-2">
          {filtered.map((u) => {
            const isMember = memberIds.has(u.id);
            const busy = busyUserId === u.id;

            return (
              <div
                key={u.id}
                className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-neutral-100 font-medium truncate">
                    {u.name}
                  </p>
                  <p className="text-neutral-500 text-sm truncate">
                    @{u.username}
                  </p>
                </div>

                {isMember ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onRemove(u.id)}
                    className="px-3 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition text-sm text-red-400 disabled:opacity-60"
                  >
                    {busy ? "..." : "Remover"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onAdd(u.id)}
                    className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold text-sm disabled:opacity-60"
                  >
                    {busy ? "..." : "Adicionar"}
                  </button>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-10">
              Nenhum usuário encontrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
