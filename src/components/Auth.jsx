import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import api from "../../api/api"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth();
  const location = useLocation()
  const [verSenha, setVerSenha] = useState(false)

  useEffect(()=>{
  const params = new URLSearchParams(location.search)

  if (params.get("r")){
    setIsLogin(false)
  }
  },[location.search])
  


  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", username: "" },
  })

  const onSubmit = async (data) => {
    setErrorMsg("")
    
    try {
      if (isLogin) {
        const response = await api.post("/token", {
          username: data.username.toLowerCase(),
          password: data.password
        })

        if (response.status === 200) {
          // SALVA USUÁRIO NO CONTEXTO[
          login(response.data.access_token, response.data)
          toast.success("Sessão iniciada!")
          navigate("/home")
        }
      } else {
        const response = await api.post("/register", {
          nome: data.name,
          usuario: data.username,
          email: data.email,
          senha_hash: data.password
        })

        if (response.status === 201 || response.status === 200) {
          setErrorMsg("Conta criada com sucesso! Faça login.")
          setIsLogin(true)
          reset()
        }
      }
    } catch (error) {
      console.error("Erro na autenticação:", error)
      setErrorMsg(error?.response?.data?.detail || "Erro ao processar requisição")
    }
  }

  const toggleMode = () => {
    setIsLogin(s => !s)
    reset()
    setErrorMsg("")
  }

  const password = watch("password")

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-gray-700 shadow-xl">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-8 tracking-wide">
          {isLogin ? "Entrar" : "Registrar"}
        </h1>

        {errorMsg && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${errorMsg.includes("sucesso") ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Nome</label>
              <input
                {...register("name", { required: "Nome é obrigatório" })}
                type="text"
                className="px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-orange-600"
                placeholder="Seu nome"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Usuário</label>
            <input
              {...register("username", {
                required: "Usuário é obrigatório",
              })}
              type="text"
              className="px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-orange-600"
              placeholder="seu usuário"
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && <span className="text-red-400 text-sm">{errors.username.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Senha</label>
            <div className="flex relative">
            <input
              {...register("password", { required: "Senha é obrigatória", minLength: { value: 8, message: "Mínimo 8 caracteres" } })}
              type={verSenha ? "text": "password"}
              className="px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-orange-600 w-100"
              placeholder="********"
              aria-invalid={errors.password ? "true" : "false"}
              
              />
              <img src="/eye.png" onClick={()=>setVerSenha(!verSenha)} className="absolute w-4 h-4 self-center right-4 top-0 bottom-0"/>
              </div>
            {!isLogin&&
            <>
              <p className="p-0 m-0 text-sm text-gray-500">A senha deve conter:</p>
              <p className="p-0 m-0 text-sm text-gray-500">- mínimo de 8 caracteres</p>
              <p className="p-0 m-0 text-sm text-gray-500">- 1 caractere especial</p>
              <p className="p-0 m-0 text-sm text-gray-500">- 1 digito numérico</p>
            </>
            }
            {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
          </div>

          {!isLogin && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Confirmar Senha</label>
                <input
                  {...register("confirmPassword", {
                    required: "Confirmação é obrigatória",
                    validate: (v) => v === password || "As senhas não coincidem",
                  })}
                  type={verSenha ? "text": "password"}
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-orange-600"
                  placeholder="********"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {errors.confirmPassword && <span className="text-red-400 text-sm">{errors.confirmPassword.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Email</label>
                <input
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido"
                    }
                  })}
                  type="email"
                  className="px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-orange-600"
                  placeholder="seu.email@exemplo.com"
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-700 rounded-xl text-lg font-semibold transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Ainda não possui conta? " : "Já possui conta? "}
          <button onClick={toggleMode} className="text-orange-500 hover:text-orange-400 underline ml-1">
            {isLogin ? "Registre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  )
}