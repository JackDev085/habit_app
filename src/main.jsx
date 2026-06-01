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
        path: "/", // Rota padrão para Home
        element: <Init />,
        index: true,
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
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
