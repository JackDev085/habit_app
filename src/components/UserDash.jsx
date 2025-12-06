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

  useEffect(() => {
    const buscaDashUser = async () => {
      try {
        const response = await api.get(`/dash?user=${user}`);
        setUserDash(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setError(true);
      }
    };

    if (user) buscaDashUser();
  }, [user]);

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        Erro ao carregar dados do gráfico
      </div>
    );

  if (!userDash)
    return (
      <div className="flex min-h-[80dvh] bg-black justify-center">
        <img
          src="/spin.svg"
          alt="Carregando"
          className="w-12 h-12 mt-10 invert"
        />
      </div>
    );

  return (
    <div className="min-h-[80dvh] bg-black text-white p-4 flex flex-col gap-8">

      <h1 className="text-3xl font-bold text-center mt-4 text-neutral-300 tracking-wide">
        Desempenho do Atleta
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-green-400 text-xl font-semibold mb-4 tracking-wide">
          Pós-Treino
        </h2>

        <MeuGrafico pos={true} avaliacao={userDash[1]} />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-green-400 text-xl font-semibold mb-4 tracking-wide">
          Pré-Treino
        </h2>

        <MeuGrafico pos={false} avaliacao={userDash[0]} />
      </div>

    </div>
  );
}
