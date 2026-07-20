import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getNotificationPermission, registerPushNotifications } from "../utils/notifications";
import { toast } from "react-toastify";

export default function NotificationBell() {
  const { user } = useAuth();
  const [permission, setPermission] = useState("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleToggleNotification = async () => {
    if (!user) {
      toast.info("Faça login para ativar as notificações no seu dispositivo.");
      return;
    }

    if (permission === "unsupported") {
      toast.warning("Seu navegador ou dispositivo não suporta notificações push.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerPushNotifications({ promptUser: true });
      const newPerm = getNotificationPermission();

      setPermission(newPerm);

      if (res.success || newPerm === "granted") {
        toast.success("Notificações push ativadas com sucesso!");
      } else if (res.permission === "denied" || newPerm === "denied") {
        toast.warning(
          "As notificações estão desativadas nas configurações do seu celular/navegador. Ative as permissões de notificação do app nas configurações do dispositivo para receber alertas."
        );
      } else {
        toast.info("Solicitação de notificação cancelada ou pendente.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao solicitar permissão para notificações.");
    } finally {
      setLoading(false);
    }
  };

  if (permission === "unsupported") {
    return null;
  }

  const isNotGranted = permission !== "granted";

  return (
    <button
      type="button"
      onClick={handleToggleNotification}
      disabled={loading}
      aria-label={
        permission === "granted"
          ? "Notificações ativas"
          : "Ativar notificações"
      }
      title={
        permission === "granted"
          ? "Notificações ativas (clique para sincronizar)"
          : "Notificações desativadas (clique para solicitar permissão)"
      }
      className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer flex items-center justify-center"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      ) : permission === "granted" ? (
        // Sino Ativo (Verde)
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Ponto indicador ativo */}
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      ) : (
        // Sino Desativado/Pendente/Negado (Sino com X Vermelho destacado)
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${permission === "denied" ? "text-rose-400" : "text-zinc-300"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Badge 'X' Vermelho */}
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow ring-2 ring-zinc-950">
            ✕
          </span>
        </div>
      )}
    </button>
  );
}
