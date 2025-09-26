"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
    <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Crear Cuenta</h2>
      {error && <p style={{ color: "tomato" }}>{error}</p>}
      <input placeholder="Nombre" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} className="border p2 wfull" />
      <input placeholder="Correo" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} className="border p2 wfull" />
      <input placeholder="Contraseña" type="password" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} className="border p2 wfull" />
      <select value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))} className="border p2 wfull">
        <option value="user">Usuario</option>
        <option value="manager">Gerente</option>
      </select>
      <button className="btn">Registrarme</button>
      <style jsx>{`
        .border{border:1px solid #ddd;margin-top:8px;padding:8px;width:100%}
        .btn{margin-top:10px;border:1px solid #ddd;padding:8px 10px}
        .wfull{width:100%}.p2{padding:8px}
      `}</style>
    </form>
  );
}
