import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import apiRoot from "../../../api/api";

export default function TodayStatusModal({ open, onClose, groupId, groupName }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ submitted: [], not_submitted: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && groupId) {
      (async () => {
        setLoading(true);
        setError("");
        try {
          const res = await apiRoot.get(`/groups/${groupId}/today-status`);
          setData(res.data ?? { submitted: [], not_submitted: [] });
        } catch (err) {
          console.error(err);
          setError("Erro ao buscar status de envio. Tente novamente.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [open, groupId]);

  if (!open) return null;

  // Defensive defaults to prevent TypeError crashes
  const submittedList = Array.isArray(data?.submitted) ? data.submitted : [];
  const notSubmittedList = Array.isArray(data?.not_submitted) ? data.not_submitted : [];

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start sm:items-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="my-auto bg-zinc-950 border border-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl cursor-default flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-zinc-900 flex items-center justify-between">
          <div>
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Controle Diário</span>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Envios de Hoje
            </h3>
            <span className="text-zinc-500 text-xs font-medium block sm:inline mt-0.5 sm:mt-0">
              Grupo: {groupName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors duration-200 text-sm font-bold uppercase tracking-wider p-2"
          >
            Fechar
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/20 text-red-300 rounded-xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <img src="/spin.svg" className="w-8 h-8 animate-spin invert opacity-60" alt="loading" />
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Atualizando status...</span>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Submitted Column */}
              <div className="flex flex-col">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Enviaram ({submittedList.length})
                </h4>

                {submittedList.length === 0 ? (
                  <div className="text-zinc-600 text-xs italic py-8 text-center border border-dashed border-zinc-900 rounded-xl">
                    Nenhum envio registrado hoje.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[250px] sm:max-h-[350px] overflow-y-auto pr-1">
                    {submittedList.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white tracking-tight">{user.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">@{user.username}</span>
                        </div>
                        <div className="flex gap-1.5 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold border ${
                              user.pre_submitted
                                ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
                                : "bg-zinc-950/40 border-zinc-800/50 text-zinc-500"
                            }`}
                          >
                            Pré-Treino
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold border ${
                              user.pos_submitted
                                ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
                                : "bg-zinc-950/40 border-zinc-800/50 text-zinc-500"
                            }`}
                          >
                            Pós-Treino
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Not Submitted Column */}
              <div className="flex flex-col">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Pendente de Envio ({notSubmittedList.length})
                </h4>

                {notSubmittedList.length === 0 ? (
                  <div className="text-zinc-600 text-xs italic py-8 text-center border border-dashed border-zinc-900 rounded-xl bg-emerald-950/5 border-emerald-900/10">
                    🎉 Todos os atletas enviaram hoje!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[250px] sm:max-h-[350px] overflow-y-auto pr-1">
                    {notSubmittedList.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 rounded-xl bg-red-950/5 border border-red-950/30 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-zinc-300 tracking-tight">{user.name}</p>
                          {user.position && (
                            <span className="text-[9px] uppercase font-bold text-zinc-500">{user.position}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">@{user.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
