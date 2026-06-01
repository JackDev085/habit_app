import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MeuGrafico from "./Graph";
import api from "../../api/api";

export default function UserDash({ user: UserProp }) {
  const [searchParams] = useSearchParams();
  const urlUser = searchParams.get("user");
  const user = urlUser || UserProp;

  const [userDash, setUserDash] = useState(null);
  const [error, setError] = useState(false);
  const [filterMonths, setFilterMonths] = useState(1);

  useEffect(() => {
    const buscaDashUser = async () => {
      try {
        const response = await api.get(`/dash?username=${user}&months=${filterMonths}`);
        setUserDash(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setError(true);
      }
    };

    if (user) buscaDashUser();
  }, [user, filterMonths]);

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-10 p-6 glass-panel rounded-xl max-w-md mx-auto">
        Erro ao carregar dados do gráfico. Por favor, tente novamente mais tarde.
      </div>
    );

  if (!userDash)
    return (
      <div className="flex min-h-[80vh] bg-[#050505] justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/spin.svg"
            alt="Carregando"
            className="w-10 h-10 animate-spin invert opacity-80"
          />
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Carregando métricas...</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-[85vh] bg-[#050505] bg-tactical text-white p-6 md:p-10 flex flex-col gap-8 selection:bg-emerald-500 selection:text-black">
      
      {/* Dashboard Title & Filter Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl w-full mx-auto mb-2 border-b border-zinc-800/80 pb-6">
        <div>
          <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Métricas de Performance</span>
          <h1 className="text-3xl sm:text-4xl font-black mt-1 text-white tracking-tight uppercase">
            Estatísticas de @{user}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Acompanhamento dinâmico das respostas de sobrecarga física e recuperação.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[160px] self-start md:self-auto">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Período</span>
          <select
            value={filterMonths}
            onChange={(e) => setFilterMonths(Number(e.target.value))}
            className="bg-zinc-950 text-zinc-200 border border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 transition cursor-pointer w-full"
          >
            <option value={1}>1 Mês (Padrão)</option>
            <option value={2}>2 Meses</option>
            <option value={3}>3 Meses</option>
            <option value={4}>4 Meses</option>
            <option value={5}>5 Meses</option>
            <option value={0}>Todo o período</option>
          </select>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto flex flex-col gap-8">
        {/* Post-Training charts */}
        <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80 shadow-2xl">
          <MeuGrafico pos={true} avaliacao={userDash[1]} />
        </div>

        {/* Pre-Training charts */}
        <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80 shadow-2xl">
          <MeuGrafico pos={false} avaliacao={userDash[0]} />
        </div>
      </div>

    </div>
  );
}
