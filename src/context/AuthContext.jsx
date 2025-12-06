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

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  // Login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    api.get("/me").then(response=>{
        if(response.status===200){
            userData = (response.data)
            localStorage.setItem("user_data", JSON.stringify(response.data));

        }
    })
    setUser(userData);
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
