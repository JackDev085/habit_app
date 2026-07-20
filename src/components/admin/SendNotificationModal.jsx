import { useState, useEffect } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function SendNotificationModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState("all"); // "all" | "group" | "user"
  const [targetGroupId, setTargetGroupId] = useState("");
  const [targetUsername, setTargetUsername] = useState("");
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingGroups(true);
      api
        .get("/groups/")
        .then((res) => setGroups(res.data || []))
        .catch((err) => console.error("Erro ao carregar grupos:", err))
        .finally(() => setLoadingGroups(false));
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      toast.warning("Por favor, preencha o título e a mensagem.");
      return;
    }

    if (targetType === "group" && !targetGroupId) {
      toast.warning("Selecione um grupo de destino.");
      return;
    }

    if (targetType === "user" && !targetUsername.trim()) {
      toast.warning("Informe o nome de usuário de destino.");
      return;
    }

    setSending(true);
    try {
      await api.post("/notifications/send", {
        title,
        body,
        target_username: targetType === "user" ? targetUsername.trim() : null,
        target_group_id: targetType === "group" ? Number(targetGroupId) : null,
      });
      toast.success("Notificação enviada com sucesso!");
      setTitle("");
      setBody("");
      setTargetUsername("");
      setTargetGroupId("");
      setTargetType("all");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Erro ao enviar notificação.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 flex flex-col gap-6">
        <div>
          <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Mensagens Instantâneas</span>
          <h3 className="text-xl font-black text-white mt-1 uppercase">
            Disparar Notificação
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Envie alertas push diretamente para todos os usuários, por grupos ou atletas específicos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Título do Alerta
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Treino de Amanhã"
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Mensagem / Conteúdo
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Ex: Lembre-se de preencher a avaliação pré-treino até as 8h."
              rows={3}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Público Alvo
            </label>
            <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setTargetType("all")}
                className={`py-2 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  targetType === "all"
                    ? "bg-emerald-500 text-black shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setTargetType("group")}
                className={`py-2 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  targetType === "group"
                    ? "bg-emerald-500 text-black shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Por Grupo
              </button>
              <button
                type="button"
                onClick={() => setTargetType("user")}
                className={`py-2 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  targetType === "user"
                    ? "bg-emerald-500 text-black shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Usuário
              </button>
            </div>
          </div>

          {targetType === "group" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Selecione o Grupo
              </label>
              <select
                value={targetGroupId}
                onChange={(e) => setTargetGroupId(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                required
              >
                <option value="">-- Escolha um grupo --</option>
                {groups.map((grp) => (
                  <option key={grp.id} value={grp.id}>
                    {grp.name}
                  </option>
                ))}
              </select>
              {loadingGroups && (
                <span className="text-[10px] text-zinc-500">Carregando grupos...</span>
              )}
            </div>
          )}

          {targetType === "user" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Username do Atleta
              </label>
              <input
                type="text"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                placeholder="ex: jackson"
                className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold text-xs transition cursor-pointer flex items-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                "Disparar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

