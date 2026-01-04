import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [verSenha, setVerSenha] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("r")) setIsLogin(false);
  }, [location.search]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      sexo: "",
      posicao: "",
      data_nascimento: "",
      telefone: "",
      peso: "",
      altura: "",
    },
    mode: "onSubmit",
  });

  const password = watch("password");

  function normalizeApiError(err) {
    const detail = err?.response?.data?.detail;

    // FastAPI pode retornar list de erros de validação
    if (Array.isArray(detail)) {
      return detail
        .map((e) => `${(e.loc || []).join(".")}: ${e.msg}`)
        .join(" | ");
    }

    return detail || "Erro ao processar requisição";
  }

  const onSubmit = async (data) => {
    setErrorMsg("");

    try {
      if (isLogin) {
        const body = new URLSearchParams();
        body.append("username", data.username);
        body.append("password", data.password);

        const response = await api.post("/token", body, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        // esperado: { access_token, token_type }
        login(response.data.access_token, response.data);
        toast.success("Sessão iniciada!");
        navigate("/home");
        return;
      }

      // register
      if (data.password !== data.confirmPassword) {
        setErrorMsg("As senhas não coincidem.");
        return;
      }

      const payload = {
        username: data.username.trim(),
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.telefone.trim(),
        sex: data.sexo,
        position: data.posicao,
        birth_date: data.data_nascimento,
        weigth: Number(data.peso),   // <- corrigido
        heigth: Number(data.altura), // <- ok
        password: data.password,
      };

      const response = await api.post("/register", payload);

      if (response.status === 201 || response.status === 200) {
        setErrorMsg("Conta criada com sucesso! Faça login.");
        setIsLogin(true);
        reset();
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      setErrorMsg(normalizeApiError(error));
    }
  };

  const toggleMode = () => {
    setIsLogin((s) => !s);
    reset();
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-gray-700 shadow-xl">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-8 tracking-wide">
          {isLogin ? "Entrar" : "Registrar"}
        </h1>

        {errorMsg && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              errorMsg.includes("sucesso")
                ? "bg-green-900 text-green-200"
                : "bg-red-900 text-red-200"
            }`}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          {!isLogin && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Nome</label>
                <input
                  {...register("name", { required: "Nome é obrigatório" })}
                  type="text"
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg focus:border-orange-600"
                  placeholder="Seu nome"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Email</label>
                <input
                  {...register("email", {
                    required: "Email obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                  type="email"
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                  placeholder="seu.email@exemplo.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Telefone</label>
                <input
                  {...register("telefone", { required: "Campo obrigatório" })}
                  type="text"
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Sexo</label>
                <select
                  {...register("sexo", { required: "Campo obrigatório" })}
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Posição de Jogo</label>
                <select
                  {...register("posicao", { required: "Campo obrigatório" })}
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                >
                  <option value="">Selecione</option>
                  <option value="Armador">Armador</option>
                  <option value="Ala-armador">Ala-armador</option>
                  <option value="Ala">Ala</option>
                  <option value="Ala-pivô">Ala-pivô</option>
                  <option value="Pivô">Pivô</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Data de Nascimento</label>
                <input
                  {...register("data_nascimento", { required: "Campo obrigatório" })}
                  type="date"
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/2 gap-2">
                  <label className="text-sm text-gray-300">Peso (kg)</label>
                  <input
                    {...register("peso", { required: "Obrigatório" })}
                    type="number"
                    className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                  />
                </div>
                <div className="flex flex-col w-1/2 gap-2">
                  <label className="text-sm text-gray-300">Altura (cm)</label>
                  <input
                    {...register("altura", { required: "Obrigatório" })}
                    type="number"
                    className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Usuário</label>
            <input
              {...register("username", { required: "Usuário é obrigatório" })}
              type="text"
              className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
              placeholder="seu usuário"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Senha</label>
            <div className="relative w-full">
              <input
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: { value: 8, message: "Mínimo 8 caracteres" },
                })}
                type={verSenha ? "text" : "password"}
                className="px-3 py-2 w-full bg-black border border-gray-700 rounded-lg"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setVerSenha((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                <img src="/eye.svg" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Confirmar Senha</label>
              <input
                {...register("confirmPassword", {
                  required: "Confirme a senha",
                  validate: (v) => v === password || "As senhas não coincidem",
                })}
                type={verSenha ? "text" : "password"}
                className="px-3 py-2 bg-black border border-gray-700 rounded-lg"
                placeholder="********"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-700 rounded-xl text-lg font-semibold disabled:opacity-60"
          >
            {isSubmitting ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Ainda não possui conta? " : "Já possui conta? "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-orange-500 hover:text-orange-400 underline ml-1"
          >
            {isLogin ? "Registre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
