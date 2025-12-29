import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function AdminView() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setError] = useState("");
  const [numUsers, setNumUsers] = useState("");
  const [users, setUsers] = useState([]);
  const [usersView, setUsersView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const num_users = await api.get("/users");
        const response = await api.get("/");

        setData(response.data);
        setNumUsers(num_users.data.usuarios);
        setUsers(num_users.data.usuarios_info);
      } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const masculino = users.filter((u) => u.sex === "Masculino");
  const feminino = users.filter((u) => u.sex === "Feminino");

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">

      {/* VOLTAR */}
      <Link
        to="/"
        className="text-green-400 hover:text-green-300 transition font-medium"
      >
        ← voltar
      </Link>

      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-center mb-12 mt-4 tracking-wide text-neutral-200">
        Painel Administrativo
      </h1>

      {/* CONTADOR */}
      {numUsers && (
        <div className="text-center mb-10">
          <span
            className="text-green-400 cursor-pointer hover:opacity-80 transition text-lg"
            onClick={() => setUsersView(!usersView)}
          >
            Usuários cadastrados:
          </span>
          <span className="text-2xl font-bold ml-2">{numUsers}</span>
        </div>
      )}

      {/* LISTA DE USUÁRIOS */}
      {usersView && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mb-14">

          {/* MASCULINO */}
          <h2 className="text-lg text-green-400 font-semibold mb-4 uppercase tracking-wide">
            Time Masculino
          </h2>

          <ul className="space-y-2 mb-8">
            {masculino.map((user, i) => (
              <li
                key={i}
                className="p-4 bg-neutral-800 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition"
              >
                <span className="font-medium tracking-wide text-neutral-200">
                  {user.name} ({user.username})
                </span>

                <button
                  onClick={() => navigate(`/dash?user=${user.username}`)}
                  className="p-2 hover:bg-neutral-600 rounded transition"
                >
                  <img
                    src="/grafico.svg"
                    className="w-6 invert"
                    alt="dash"
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* FEMININO */}
          <h2 className="text-lg text-green-400 font-semibold mb-4 uppercase tracking-wide">
            Time Feminino
          </h2>

          <ul className="space-y-2">
            {feminino.map((user, i) => (
              <li
                key={i}
                className="p-4 bg-neutral-800 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition"
              >
                <span className="font-medium tracking-wide text-neutral-200">
                  {user.name} ({user.username})
                </span>

                <button
                  onClick={() => navigate(`/dash?user=${user.username}`)}
                  className="p-2 hover:bg-neutral-600 rounded transition"
                >
                  <img
                    src="/grafico.svg"
                    className="w-6 invert"
                    alt="dash"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* LOADING */}
      {loading && (
        <div className="flex justify-center my-10">
          <img src="/spin.svg" className="w-12  invert" />
        </div>
      )}

      {/* ERRO */}
      {erro && (
        <p className="text-red-500 text-center mb-6">{erro}</p>
      )}

      {/* LISTA DE AVALIAÇÕES */}
      {!loading && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-8 text-green-400 tracking-wide">
            Resumo de avaliações
          </h2>

          {data.length === 0 ? (
            <p className="text-neutral-500 text-center">
              Nenhuma avaliação registrada
            </p>
          ) : (
            <div className="grid gap-6">
              {data.map((ele, key) => (
                <div
                  key={key}
                  className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl"
                >
                  <p className="text-lg font-semibold mb-4 tracking-wide text-green-300">
                    {ele.usuario}
                  </p>

                  {/* PRÉ */}
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">
                      Pré-treino
                    </h3>

                    <ul className="flex flex-wrap gap-3">
                      {ele.pre &&
                        Object.keys(ele.pre).map((key) => {
                          const val = ele.pre[key];
                          const color =
                            val > 2.5 ? "text-green-400" : "text-red-400";

                          return (
                            <li
                              key={key}
                              className={`bg-neutral-800 px-4 py-2 rounded-lg text-center ${color}`}
                            >
                              <span className="uppercase text-xs tracking-wide block text-neutral-400">
                                {key}
                              </span>
                              <span className="font-bold text-lg">{val}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>

                  {/* PÓS */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">
                      Pós-treino
                    </h3>

                    <ul className="flex flex-wrap gap-3">
                      {ele.pos &&
                        Object.keys(ele.pos).map((key) => {
                          const val = ele.pos[key];
                          const color =
                            val > 2.5 ? "text-green-400" : "text-red-400";

                          return (
                            <li
                              key={key}
                              className={`bg-neutral-800 px-4 py-2 rounded-lg text-center ${color}`}
                            >
                              <span className="uppercase text-xs tracking-wide block text-neutral-400">
                                {key}
                              </span>
                              <span className="font-bold text-lg">{val}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
