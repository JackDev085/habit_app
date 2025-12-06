import { useLocation , Link} from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  // Exemplo: /treinos/exercicios -> ["treinos", "exercicios"]

  return (
    <div className="w-full bg-[#0d0d0d] border-b border-gray-800 px-6 md:px-16 py-3 text-sm text-gray-400">
      <div className="flex gap-2 items-center">
        <Link to="/" className="hover:text-orange-500">Início</Link>

        {parts.map((part, index) => {
          const path = "/" + parts.slice(0, index + 1).join("/");
          const formatted = part.charAt(0).toUpperCase() + part.slice(1);

          return (
            <span key={index} className="flex items-center gap-2">
              <span>/</span>
              <Link to={path} className="hover:text-orange-400">
                {formatted}
              </Link>
            </span>
          );
        })}
      </div>
    </div>
  );
}