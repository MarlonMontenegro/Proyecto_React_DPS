"use client";
import React from "react";
import Protected from "@/components/Protected";
import RoleGate from "@/components/RoleGate";
import { useAuth } from "@/contexts/AuthContext";
import {
  apiListProjects,
  apiCreateProject,
  apiPatchProject,
  apiDeleteProject,
} from "@/lib/api";

const USERS_KEY = "pm_users";

function safeGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [projects, setProjects] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("projects"); // projects | assign | progress

  // Form crear/editar proyecto
  const emptyForm = { title: "", description: "", duration: "", phasesText: "" };
  const [form, setForm] = React.useState(emptyForm);
  const [editingId, setEditingId] = React.useState(null);

  // Cargar datos iniciales
  async function loadProjects() {
    try {
      const list = await apiListProjects();
      setProjects(list);
    } catch (e) {
      console.error(e);
      alert("No se pudieron cargar los proyectos");
    }
  }

  React.useEffect(() => {
    loadProjects();                     // proyectos desde la API
    setUsers(safeGet(USERS_KEY, []));   // usuarios desde localStorage (como ya tienes)
  }, []);

  // --------- Helpers ----------
  function phasesFromText(text) {
    const names = text.split(",").map(s => s.trim()).filter(Boolean);
    return names.map((name, idx) => ({ id: Date.now() + idx, name, doneBy: [] }));
  }

  // --------- CRUD Proyectos (Gerente) ----------
  async function onSubmitProject(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;

    const base = {
      title,
      description: form.description.trim(),
      duration: form.duration.trim(),
      phases: phasesFromText(form.phasesText),
    };

    try {
      if (editingId) {
        await apiPatchProject(editingId, base);
        setEditingId(null);
      } else {
        await apiCreateProject(base);
      }
      setForm(emptyForm);
      await loadProjects();
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar el proyecto");
    }
  }

  function onEditProject(p) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      duration: p.duration || "",
      phasesText: p.phases?.map(f => f.name).join(", ") || "",
    });
    setActiveTab("projects");
  }

  function onCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  // --------- Asignaciones (Gerente) ----------
  async function assignProjectTo(email, projectId) {
    const pid = Number(projectId);
    const p = projects.find(x => x.id === pid);
    if (!p) return;
    const members = Array.from(new Set([...(p.members || []), email]));
    try {
      await apiPatchProject(pid, { members });
      await loadProjects();
    } catch (e) {
      console.error(e);
      alert("No se pudo asignar el proyecto");
    }
  }

  async function unassignProjectFrom(email, projectId) {
    const pid = Number(projectId);
    const p = projects.find(x => x.id === pid);
    if (!p) return;
    const members = (p.members || []).filter(m => m !== email);
    try {
      await apiPatchProject(pid, { members });
      await loadProjects();
    } catch (e) {
      console.error(e);
      alert("No se pudo quitar la asignación");
    }
  }

  // --------- Progreso (User & Gerente) ----------
  async function togglePhaseForUser(projectId, phaseId, email) {
    const p = projects.find(x => x.id === projectId);
    if (!p) return;

    const phases = (p.phases || []).map(f => {
      if (f.id !== phaseId) return f;
      const set = new Set(f.doneBy || []);
      set.has(email) ? set.delete(email) : set.add(email);
      return { ...f, doneBy: Array.from(set) };
    });

    try {
      await apiPatchProject(projectId, { phases });
      await loadProjects();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar la fase");
    }
  }

  function projectProgressForEmail(p, email) {
    const phases = p.phases || [];
    if (phases.length === 0) return 0;
    const completed = phases.filter(f => (f.doneBy || []).includes(email)).length;
    return Math.round((completed / phases.length) * 100);
  }

  const myProjects = React.useMemo(
    () => projects.filter(p => (p.members || []).includes(user?.email)),
    [projects, user?.email]
  );

  // diseño pestañas
  const TabButton = ({ id, children }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={id === activeTab ? "tab tab--active" : "tab"}
    >
      {children}
      <style jsx>{`
        .tab {
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #111;
          padding: 8px 12px;
          border-radius: 8px;
          margin-right: 8px;
          cursor: pointer;
        }
        .tab--active {
          background: #0ea5e9;
          color: #fff;
          border-color: #0ea5e9;
        }
      `}</style>
    </button>
  );

  return (
    <Protected>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Dashboard</h1>
        <button onClick={logout} style={{ textDecoration: "underline" }}>Cerrar sesión</button>
      </div>

      <p>Sesión como <b>{user?.name}</b> ({user?.role}).</p>

      {/* ---------------- VISTA GERENTE ---------------- */}
      <RoleGate allow={["manager"]}>
        <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginTop: 12 }}>
          <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Vista de Gerente</h2>

          <div style={{ display: "flex", marginBottom: 12 }}>
            <TabButton id="projects">Crear / Editar proyectos</TabButton>
            <TabButton id="assign">Asignar tareas</TabButton>
            <TabButton id="progress">Ver progreso global</TabButton>
          </div>

          {/* ---  Crear / Editar Proyectos --- */}
          {activeTab === "projects" && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>{editingId ? "Editar proyecto" : "Crear proyecto"}</h3>
              <form onSubmit={onSubmitProject} className="grid">
                <label>
                  Título del proyecto
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Ej. Rediseño web"
                  />
                </label>

                <label>
                  Descripción
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Breve descripción del objetivo"
                  />
                </label>

                <label>
                  Tiempo a finalizar
                  <input
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="Ej. 2 semanas / 10 días"
                  />
                </label>

                <label>
                  Fases (separadas por coma)
                  <input
                    value={form.phasesText}
                    onChange={e => setForm({ ...form, phasesText: e.target.value })}
                    placeholder="Investigación, Diseño, Implementación, Pruebas"
                  />
                </label>

                <div className="actions">
                  <button type="submit" className="primary">{editingId ? "Guardar cambios" : "Crear proyecto"}</button>
                  {editingId && (
                    <button type="button" onClick={onCancelEdit} className="ghost">Cancelar</button>
                  )}
                </div>
              </form>

              <h4 style={{ margin: "16px 0 8px" }}>Proyectos existentes</h4>
              <ul className="list">
                {projects.length === 0 && <li>No hay proyectos aún.</li>}
                {projects.map(p => (
                  <li key={p.id} className="row">
                    <div>
                      <b>{p.title}</b> — {p.duration || "sin duración"}<br />
                      <small>{p.description}</small><br />
                      <small>Fases: {(p.phases || []).map(f => f.name).join(", ") || "—"}</small><br />
                      <small>Miembros: {(p.members || []).length}</small>
                    </div>
                    <div className="row-actions">
                      <button className="primary" onClick={() => onEditProject(p)}>Editar</button>
                      <button
                        className="danger"
                        onClick={async () => {
                          if (confirm(`¿Terminar/eliminar el proyecto "${p.title}"?`)) {
                            try {
                              await apiDeleteProject(p.id); 
                              if (editingId === p.id) onCancelEdit();
                              await loadProjects();
                            } catch (e) {
                              console.error(e);
                              alert("No se pudo eliminar el proyecto");
                            }
                          }
                        }}
                      >
                        Terminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- Asignar tareas --- */}
          {activeTab === "assign" && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Asignar proyectos a usuarios</h3>
              {users.length === 0 && <p>No hay usuarios registrados.</p>}
              {users.length > 0 && projects.length === 0 && <p>Crea proyectos primero.</p>}
              <ul className="list">
                {users.map(u => (
                  <li key={u.email} className="row">
                    <div>
                      <b>{u.name}</b> — <small>{u.email}</small> ({u.role})
                      <div style={{ marginTop: 6 }}>
                        <label>Asignar al proyecto:&nbsp;</label>
                        <select id={`sel-${u.email}`} defaultValue="">
                          <option value="" disabled>Selecciona un proyecto…</option>
                          {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const sel = document.getElementById(`sel-${u.email}`);
                            if (sel && sel.value) assignProjectTo(u.email, sel.value);
                          }}
                          style={{ marginLeft: 8 }}
                        >
                          Asignar
                        </button>
                      </div>
                      {(projects || [])
                        .filter(p => (p.members || []).includes(u.email))
                        .map(p => (
                          <div key={p.id} style={{ marginTop: 6 }}>
                            <small>Asignado a: <b>{p.title}</b></small>
                            <button
                              onClick={() => unassignProjectFrom(u.email, p.id)}
                              className="ghost"
                              style={{ marginLeft: 8 }}
                            >
                              Quitar
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- Progreso global --- */}
          {activeTab === "progress" && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Progreso global</h3>
              {projects.length === 0 && <p>No hay proyectos aún.</p>}
              <ul className="list">
                {projects.map(p => (
                  <li key={p.id} className="row">
                    <div style={{ width: "100%" }}>
                      <b>{p.title}</b> — {p.duration || "sin duración"}<br />
                      <small>Miembros: {(p.members || []).length} · Fases: {(p.phases || []).length}</small>
                      <div style={{ marginTop: 8 }}>
                        {(p.members || []).length === 0 && <small>No hay usuarios asignados.</small>}
                        {(p.members || []).map(email => (
                          <div key={email} style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
                            <span style={{ minWidth: 220 }}>{email}</span>
                            <Progress value={projectProgressForEmail(p, email)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </RoleGate>

      {/* ---------------- VISTA USUARIO ---------------- */}
      <RoleGate allow={["user","manager"]}>
        <section style={{ border:"1px solid #ddd", padding:12, borderRadius:8, marginTop:12 }}>
          <h2 style={{ fontWeight: 600 }}>Vista de Usuario</h2>

          {/* Proyectos asignados a mí */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Mis proyectos asignados</h3>
            {myProjects.length === 0 && <p>No tienes proyectos asignados.</p>}

            {myProjects.map(p => (
              <div key={p.id} className="assigned">
                <div className="assigned-head">
                  <div>
                    <b>{p.title}</b> — {p.duration || "sin duración"}<br />
                    <small>{p.description}</small>
                  </div>
                  <div style={{ minWidth: 180 }}>
                    <Progress value={projectProgressForEmail(p, user.email)} />
                  </div>
                </div>

                <ul className="phases">
                  {(p.phases || []).length === 0 && <li>No hay fases definidas para este proyecto.</li>}
                  {(p.phases || []).map(f => {
                    const checked = (f.doneBy || []).includes(user.email);
                    return (
                      <li key={f.id} className="phase-row">
                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePhaseForUser(p.id, f.id, user.email)}
                          />
                          <span>{f.name}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </RoleGate>

      {/* ====== ESTILOS ====== */}
      <style jsx>{`
        .card {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px;
          margin-top: 12px;
          background: #fff;
          color: #111;          
          color-scheme: light;   
        }

        /* Texto dentro de las cards */
        .card :is(h1,h2,h3,h4,h5,h6,p,small,li,label,span,strong) {
          color: #111;
        }

       
        .grid label { display: block; margin: 8px 0; font-size: 14px; color: #111; }
        .grid input, .grid textarea, .grid select {
          width: 100%;
          padding: 8px;
          border: 1px solid #cbd5e1; 
          border-radius: 8px;
          margin-top: 4px;
          background: #fff;
          color: #111;
        }
        .grid input::placeholder, .grid textarea::placeholder { color: #9ca3af; }

        .actions { margin-top: 8px; display: flex; gap: 8px; }
        .actions .ghost {
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          color: #111;
        }

        .list { list-style: none; padding: 0; margin: 8px 0 0; }
        .row { display: flex; justify-content: space-between; align-items: flex-start; border-top: 1px dashed #eee; padding: 10px 0; }
        .row:first-child { border-top: none; }
        .row-actions button { margin-left: 8px; }

        .assigned { border: 1px dashed #e5e7eb; padding: 10px; border-radius: 8px; margin-top: 10px; background: #fff; color: #111; }
        .assigned-head { display: flex; justify-content: space-between; align-items: center; }
        .phases { list-style: none; padding: 0; margin: 8px 0 0; }
        .phase-row { padding: 6px 0; border-top: 1px solid #f3f4f6; }
        .phase-row:first-child { border-top: none; }

        .card .grid input,
        .card .grid textarea,
        .card .grid select {
          background: #111;          
          color: #fff;               
          border: 1px solid #374151; 
        }
        .card .grid input::placeholder,
        .card .grid textarea::placeholder {
          color: #9ca3af;
        }
        .card .grid input:focus,
        .card .grid textarea:focus,
        .card .grid select:focus {
          outline: 2px solid #0ea5e9; 
          border-color: #0ea5e9;
        }
        .card .grid select option {
          background: #111;
          color: #fff;
        }

        /* Botones de acciones */
        .row-actions .primary,
        .row-actions .danger {
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .row-actions .primary {
          background: #0ea5e9;   /* azul/cyan */
          color: #fff;
          border-color: #0ea5e9;
        }
        .row-actions .primary:hover { filter: brightness(0.95); }
        .row-actions .danger {
          background: #ef4444;
          color: #fff;
          border-color: #ef4444;
        }
        .row-actions .danger:hover { filter: brightness(0.95); }
      `}</style>
    </Protected>
  );
}

// Barra de progreso
function Progress({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div style={{ width: "100%", height: 8, borderRadius: 999, background: "#f1f5f9" }}>
      <div style={{
        width: `${v}%`,
        height: 8,
        background: "#10b981",
        borderRadius: 999,
        transition: "width .2s ease"
      }} />
      <div style={{ fontSize: 12, marginTop: 4, color: "#111" }}>{v}%</div>
    </div>
  );
}
