import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import NotificationBell from "../components/NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth(null);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close on Escape and lock body scroll when menu is open
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 md:px-16 py-4 flex items-center justify-between text-white transition-all">
        {/* Logo */}
        <Link to="/" className="tracking-wide uppercase hover:opacity-90 transition-opacity flex items-center">
          <img className="h-9" src="/logo.svg" alt="Load Basketball" />
        </Link>

        {/* Right side controls (Notification Bell + Desktop Nav + Mobile Hamburger) */}
        <div className="flex items-center gap-4">
          {/* Notification Bell - ALWAYS visible on mobile & desktop */}
          <NotificationBell />

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider font-bold text-zinc-300">
            {user ? (
              <>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className={`hover:text-emerald-400 transition ${location.pathname === "/admin" ? "text-emerald-400 font-extrabold" : ""}`}
                  >
                    Painel Admin
                  </Link>
                )}
                
                {user.username && (
                  <Link
                    to={`/dash?user=${user.username}`}
                    className={`hover:text-emerald-400 transition ${location.pathname === "/dash" ? "text-emerald-400 font-extrabold" : ""}`}
                  >
                    Meu Dash
                  </Link>
                )}

                <Link
                  to="/home"
                  className={`hover:text-emerald-400 transition ${location.pathname === "/home" ? "text-emerald-400 font-extrabold" : ""}`}
                >
                  Início
                </Link>

                <button
                  onClick={logout}
                  className="hover:text-emerald-400 transition cursor-pointer text-sm uppercase tracking-wider font-bold text-zinc-400"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition font-bold"
              >
                Entrar
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-controls="mobile-menu"
              aria-expanded={open}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((s) => !s)}
              className="p-2 pr-0 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-300 hover:text-white"
            >
              {!open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>


      {/* Mobile menu panel - rendered outside header to avoid backdrop-filter fixed positioning containment */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 w-72 h-screen bg-zinc-950 text-white p-6 shadow-2xl flex flex-col gap-8 border-l border-zinc-900 z-50">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={() => setOpen(false)} className="tracking-wide uppercase">
                <img className="h-8" src="/logo.svg" alt="logo" />
              </Link>
              <button
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div id="mobile-menu" className="flex flex-col gap-6 mt-6 text-base uppercase tracking-wider font-bold text-zinc-300">
              {user ? (
                <>
                  {user.is_admin && (
                    <Link
                      onClick={() => setOpen(false)}
                      to="/admin"
                      className={`hover:text-emerald-400 transition ${location.pathname === "/admin" ? "text-emerald-400" : ""}`}
                    >
                      Painel Admin
                    </Link>
                  )}

                  {user.username && (
                    <Link
                      onClick={() => setOpen(false)}
                      to={`/dash?user=${user.username}`}
                      className={`hover:text-emerald-400 transition ${location.pathname === "/dash" ? "text-emerald-400" : ""}`}
                    >
                      Meu Dash
                    </Link>
                  )}

                  <Link
                    onClick={() => setOpen(false)}
                    to="/home"
                    className={`hover:text-emerald-400 transition ${location.pathname === "/home" ? "text-emerald-400" : ""}`}
                  >
                    Início
                  </Link>
                  
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="hover:text-emerald-400 transition text-left cursor-pointer uppercase tracking-wider font-bold text-zinc-500"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  onClick={() => setOpen(false)}
                  to="/auth"
                  className="px-4 py-3 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition text-center font-extrabold"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
