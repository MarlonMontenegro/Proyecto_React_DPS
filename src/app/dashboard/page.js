"use client";
import Protected from "@/components/Protected";
import RoleGate from "@/components/RoleGate";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <Protected>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Dashboard</h1>
        <button onClick={logout} style={{ textDecoration: "underline" }}>Cerrar sesión</button>
      </div>

      <p>Sesión como <b>{user?.name}</b> ({user?.role}).</p>

      <RoleGate allow={["manager"]}>
        <section style={{ border:"1px solid #ddd", padding:12, borderRadius:8, marginTop:12 }}>
          <h2 style={{ fontWeight: 600 }}>Acciones de Gerente</h2>
          <ul>
            <li>Crear/editar proyectos</li>
            <li>Asignar tareas</li>
            <li>Ver progreso global</li>
          </ul>
        </section>
      </RoleGate>

      <RoleGate allow={["user","manager"]}>
        <section style={{ border:"1px solid #ddd", padding:12, borderRadius:8, marginTop:12 }}>
          <h2 style={{ fontWeight: 600 }}>Vista de Usuario</h2>
          <ul>
            <li>Ver proyectos asignados</li>
            <li>Actualizar estado de tareas</li>
          </ul>
        </section>
      </RoleGate>
    </Protected>
  );
}
