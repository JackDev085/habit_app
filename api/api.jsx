import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://habit-backend-five.vercel.app",
  //baseURL: "http://127.0.0.1:8000",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    // rota de onde a requisição foi feita (valor definido no request interceptor)
    const requestRoute = error?.config?._clientRoute ?? (typeof window !== "undefined" ? window.location?.pathname : "/");

    if (status === 401) {
      // se a requisição veio da página /auth, não forçar redirect para login
      if (requestRoute !== "/auth") {
        toast.warning("Necessário fazer login novamente");
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");

        // redireciona para a tela de login
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default api