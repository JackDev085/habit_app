import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="w-full bg-black border-b border-gray-800 px-6 md:px-16 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <Link to="/" className="tracking-wide uppercase">
        <img className="h-10" src="/logo.svg" alt="" />
      </Link>

      {/* Links */}
      <nav className="flex items-center gap-6 text-lg font-semibold">
        {user ? (

          <>
          {user.usuario == "jackson" || user.usuario=="msampaio21" ?
          <Link to="/admin" className={`hover:text-green-500 transition ${location.pathname === "/admin" ? "text-green-500" : ""}`}>Admin</Link>
 :""}
        <Link to="/home" className={`hover:text-green-500 transition ${location.pathname === "/home" ? "text-green-500" : ""}`}>Início</Link>
          <button onClick={logout} className="hover:text-green-500 transition">
            Sair
          </button>
          </>
        ) : (
          <Link to="/auth" className="hover:text-green-500 transition">
            Entrar
          </Link>
        )}
        
        
        {//<Link to="/planos" className={`hover:text-green-500 transition ${location.pathname === "/planos" ? "text-green-500" : ""}`}>Planos</Link>
}
       {// <Link to="/auth" className={`hover:text-green-500 transition ${location.pathname === "/auth" ? "text-green-500" : ""}`}>Entrar</Link>
} 
      </nav>
    </header>
  );
}
