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
    <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Iniciar Sesión</h2>
      {error && <p style={{ color: "tomato" }}>{error}</p>}
      <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} className="border p2 wfull" />
      <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p2 wfull" />
      <button className="btn">Entrar</button>
      <style jsx>{`
        .border{border:1px solid #ddd;margin-top:8px;padding:8px;width:100%}
        .btn{margin-top:10px;border:1px solid #ddd;padding:8px 10px}
        .wfull{width:100%}.p2{padding:8px}
      `}</style>
    </form>
  );
}
