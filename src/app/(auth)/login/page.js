"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await login(email.trim(), password);
    if (!res.ok) setError(res.message || "Error");
    else router.push("/dashboard");
  }

  return (
    <div className="container">
      {/* Título principal fuera del cuadro */}
      <div className="main-title">
        <h1>Sistema de Gestión de Proyectos</h1>
      </div>

      {/* Caja blanca del formulario */}
      <div className="login-box">
        <form onSubmit={onSubmit}>
          <h2>Welcome back</h2>
          <p className="subtitle">Nos alegra verte</p>

          {error && <p className="error">{error}</p>}

          <input
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border wfull"
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border wfull"
          />

          <button className="btn">Entrar</button>
        </form>
      </div>

      {/* Estilos */}
      <style jsx global>{`
        /* Estilo global para body */
        body {
          background: black;
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          padding-top: 80px;
          color: white;
          text-align: center;
        }

        .main-title {
          margin-bottom: 20px;
        }
        .main-title h1 {
          font-size: 28px;
          margin: 0;
        }

        .login-box {
          background: white;
          color: black;
          padding: 24px;
          border-radius: 8px;
          width: 300px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .login-box h2 {
          margin-bottom: 8px;
        }

        .subtitle {
          margin-bottom: 16px;
          font-size: 14px;
          color: #555;
        }

        .border {
          border: 1px solid #ddd;
          margin-top: 8px;
          padding: 8px;
          width: 100%;
        }

        .btn {
          margin-top: 12px;
          border: 1px solid #ddd;
          padding: 8px 10px;
          background: #333;
          color: white;
          width: 100%;
          cursor: pointer;
          border-radius: 4px;
        }
        .btn:hover {
          background: #555;
        }

        .error {
          color: tomato;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}
