// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teste,setTeste] = useState("")

  // Carrega token do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user_data");

    if (token) {
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Busca perfil atualizado em background para manter sincronismo
      api.get("/me")
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("user_data", JSON.stringify(response.data));
            setUser(response.data);
          }
        })
        .catch((err) => {
          console.error("Erro ao sincronizar perfil na inicialização:", err);
        });
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (token) => {
    localStorage.setItem("token", token);
    try {
      const response = await api.get("/me");
      if (response.status === 200) {
        localStorage.setItem("user_data", JSON.stringify(response.data));
        setUser(response.data);
        return response.data;
      }
    } catch (err) {
      console.error("Error loading user profile on login", err);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
