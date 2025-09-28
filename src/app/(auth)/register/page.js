"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = React.useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = React.useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await register(form);
    if (!res.ok) setError(res.message || "Error");
    else router.push("/dashboard");
  }

  return (
    <div className="container">
      {/* Header principal */}
      <div className="main-title">
        <h1>Sistema de Gestión de Proyectos</h1>
      </div>

      {/* Caja blanca */}
      <div className="login-box">
        <form onSubmit={onSubmit}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Crear Cuenta</h2>
          {error && <p className="error">{error}</p>}

          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="border p2 wfull"
          />
          <input
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="border p2 wfull"
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="border p2 wfull"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="border p2 wfull"
          >
            <option value="user">Usuario</option>
            <option value="manager">Gerente</option>
          </select>
          <button className="btn">Registrarme</button>
        </form>
      </div>

      {/* Estilos */}
      <style jsx global>{`
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

        .error {
          color: tomato;
          margin: 8px 0;
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
        .wfull {
          width: 100%;
        }
        .p2 {
          padding: 8px;
        }
      `}</style>
    </div>
  );
}
