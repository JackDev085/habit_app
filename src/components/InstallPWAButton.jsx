import { useEffect, useState } from "react";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // impede o mini-infobar automático
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    // você pode logar isso, se quiser
    console.log("PWA install choice:", choice.outcome);

    setDeferredPrompt(null);
    setCanInstall(false);
  }

  if (!canInstall) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        padding: 12,
        borderRadius: 12,
        background: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        zIndex: 9999,
      }}
    >
      <div>
        <strong>Instalar Load Basketball</strong>
        <div style={{ fontSize: 12, opacity: 0.9 }}>
          Acesse mais rápido direto do seu celular.
        </div>
      </div>

      <button
        onClick={handleInstallClick}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Instalar
      </button>
    </div>
  );
}
