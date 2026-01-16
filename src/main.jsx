import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Componentes
import App from "./App.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import Auth from "./components/Auth.jsx";
import Init from "./components/Init.jsx";
import Home from "./components/Home.jsx";
import AdminView from "./components/Admin.jsx";
import UserDash from "./components/UserDash.jsx";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.jsx").then(() => {
      console.log("Service Worker registrado!");
    });
  });
}

// Configure as rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "", // Rota padrão para Home
        element: <Init />,
      },
      {
        path: "home", // Rota padrão para Home
        element: <Home />,
      },
      {
        path: "admin", // Rota padrão para Home
        element: <AdminView />,
      },
      {
        path: "dash", // Rota padrão para Home
        element: <UserDash />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
