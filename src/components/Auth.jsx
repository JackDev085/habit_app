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

        await login(response.data.access_token);
        toast.success("Sessão iniciada!");
        navigate("/home");
        return;
      }

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
        weigth: Number(data.peso),
        heigth: Number(data.altura),
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
    <div className="min-h-screen w-full bg-[#050505] bg-tactical flex items-center justify-center px-4 py-20 text-white selection:bg-emerald-500 selection:text-black">
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-zinc-800 shadow-2xl relative z-10">
        
        {/* Basketball Court tactical mini design top-right decoration */}
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <svg className="w-16 h-16 text-emerald-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="40" />
            <line x1="50" y1="10" x2="50" y2="90" />
            <circle cx="50" cy="50" r="10" />
          </svg>
        </div>

        <span className="block text-center text-emerald-500 font-bold uppercase tracking-wider text-xs mb-1">
          Load Basketball
        </span>

        <h1 className="text-3xl font-black text-center uppercase mb-8 tracking-tight text-white">
          {isLogin ? "Entrar na Quadra" : "Criar Cadastro"}
        </h1>

        {errorMsg && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm border font-medium ${
              errorMsg.includes("sucesso")
                ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-300"
                : "bg-red-950/40 border-red-500/20 text-red-300"
            }`}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Usuário</label>
            <input
              {...register("username", { required: "Usuário é obrigatório" })}
              type="text"
              className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
              placeholder="Ex: cestinha085"
            />
          </div>

          {!isLogin && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Nome Completo</label>
                <input
                  {...register("name", { required: "Nome é obrigatório" })}
                  type="text"
                  className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Email</label>
                <input
                  {...register("email", {
                    required: "Email obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                  type="email"
                  className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Telefone</label>
                <input
                  {...register("telefone", { required: "Campo obrigatório" })}
                  type="text"
                  className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                  placeholder="(00) 90000-0000"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Gênero</label>
                <select
                  {...register("sexo", { required: "Campo obrigatório" })}
                  className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                >
                  <option value="" className="bg-zinc-950">Selecione</option>
                  <option value="Masculino" className="bg-zinc-950">Masculino</option>
                  <option value="Feminino" className="bg-zinc-950">Feminino</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Posição de Jogo</label>
                <select
                  {...register("posicao", { required: "Campo obrigatório" })}
                  className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                >
                  <option value="" className="bg-zinc-950">Selecione</option>
                  <option value="Armador" className="bg-zinc-950">Armador (PG)</option>
                  <option value="Ala-armador" className="bg-zinc-950">Ala-armador (SG)</option>
                  <option value="Ala" className="bg-zinc-950">Ala (SF)</option>
                  <option value="Ala-pivô" className="bg-zinc-950">Ala-pivô (PF)</option>
                  <option value="Pivô" className="bg-zinc-950">Pivô (C)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Data de Nascimento</label>
                <input
                  {...register("data_nascimento", { required: "Campo obrigatório" })}
                  type="date"
                  className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/2 gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Peso (kg)</label>
                  <input
                    {...register("peso", { required: "Obrigatório" })}
                    type="number"
                    className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                    placeholder="Ex: 85"
                  />
                </div>
                <div className="flex flex-col w-1/2 gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Altura (cm)</label>
                  <input
                    {...register("altura", { required: "Obrigatório" })}
                    type="number"
                    className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                    placeholder="Ex: 195"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Senha</label>
            <div className="relative w-full">
              <input
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: { value: 8, message: "Mínimo 8 caracteres" },
                })}
                type={verSenha ? "text" : "password"}
                className="px-4 py-3 w-full bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setVerSenha((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                <img src="/eye.svg" className="w-5 h-5 invert opacity-70 hover:opacity-100" alt="Exibir" />
              </button>
            </div>
            {!isLogin && (
              <div className="mt-1 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 text-xs text-zinc-500 flex flex-col gap-1">
                <span className="font-semibold text-zinc-400 uppercase tracking-wide text-[10px] mb-0.5">Segurança da Senha</span>
                <span>• Mínimo de 8 caracteres</span>
                <span>• Pelo menos 1 caractere especial</span>
                <span>• Pelo menos 1 dígito</span>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Confirmar Senha</label>
              <input
                {...register("confirmPassword", {
                  required: "Confirme a senha",
                  validate: (v) => v === password || "As senhas não coincidem",
                })}
                type={verSenha ? "text" : "password"}
                className="px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
                placeholder="********"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-base font-extrabold shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Carregando quadra..." : isLogin ? "Entrar" : "Criar Cadastro"}
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6 text-sm">
          {isLogin ? "Ainda não possui conta? " : "Já possui conta? "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1"
          >
            {isLogin ? "Registre-se" : "Entrar"}
          </button>
        </p>

      </div>
    </div>
  );
}
