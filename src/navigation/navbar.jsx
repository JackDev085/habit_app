import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";


export default function Navbar() {
  const { user, logout } = useAuth(null);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // close on Escape and lock body scroll when menu is open
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
    <header className="w-full bg-black border-b border-gray-800 px-6 md:px-16 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <Link to="/" className="tracking-wide uppercase">
        <img className="h-10" src="/logo.svg" alt="" />
      </Link>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-6 text-lg font-semibold">
        {user ? (
          <>
            {(user.username == "jackson" || user.username == "msampaio21") && (
              <Link
                to="/admin"
                className={`hover:text-green-500 transition ${location.pathname === "/admin" ? "text-green-500" : ""}`}>
                Admin
              </Link>
            )}
            <Link
              to="/home"
              className={`hover:text-green-500 transition ${location.pathname === "/home" ? "text-green-500" : ""}`}>
              Início
            </Link>
            <button
              onClick={logout}
              className="hover:text-green-500 transition"
            >
              Sair
            </button>
          </>
        ) : (
          <Link to="/auth" className="hover:text-green-500 transition">
            Entrar
          </Link>
        )}
      </nav>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((s) => !s)}
          className="p-2 pr-0 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Mobile menu panel */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 w-64 h-full bg-black text-white p-6 shadow-lg flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="tracking-wide uppercase">
                <img className="h-8" src="/logo.svg" alt="logo" />
              </Link>
              <button
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div id="mobile-menu" className="flex  gap-2 flex-col mt-4 text-lg font-regular">
              {user ? (
                <>
                  {(user.username == "jackson" || user.username == "msampaio21") && (
                    <Link onClick={() => setOpen(false)} to="/admin" className={`hover:text-green-500 transition ${location.pathname === "/admin" ? "text-green-500" : ""}`}>
                      Admin
                    </Link>
                  )}

                  {(user.username) && (
                    <Link onClick={() => setOpen(false)} to={`/dash?user=${user.username}`}  className={`hover:text-green-500 transition ${location.pathname === "/dash" ? "text-green-500" : ""}`}>
                    Meu dash
                    </Link>
                  )}
                  
                  <Link onClick={() => setOpen(false)} to="/home" className={`hover:text-green-500 transition ${location.pathname === "/home" ? "text-green-500" : ""}`}>
                    Início
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="hover:text-green-500 transition text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link onClick={() => setOpen(false)} to="/auth" className="hover:text-green-500 transition">
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
