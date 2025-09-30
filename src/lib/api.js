
export const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";


// crear
const toApiProject = (p) => ({
  name: p.title,
  description: p.description,
  duration: p.duration,
  phases: p.phases ?? [],
  members: p.members ?? [],
  active: true,
});

// patch parcial
const toApiPatch = (patch) => {
  const out = {};
  if ("title" in patch) out.name = patch.title;
  if ("description" in patch) out.description = patch.description;
  if ("duration" in patch) out.duration = patch.duration;
  if ("phases" in patch) out.phases = patch.phases;
  if ("members" in patch) out.members = patch.members;
  if ("active" in patch) out.active = patch.active;
  return out;
};

// leer
const fromApiProject = (p) => ({
  id: p.id,
  title: p.name,
  description: p.description ?? "",
  duration: p.duration ?? "",
  phases: p.phases ?? [],
  members: p.members ?? [],
});

// lanzar error legible
async function jsonOrThrow(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ============================
    API
============================ */
export async function apiListProjects() {
  const res = await fetch(`${API}/projects`, { cache: "no-store" });
  const data = await jsonOrThrow(res);
  return data.map(fromApiProject);
}

export async function apiCreateProject(frontBase) {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiProject(frontBase)),
  });
  const data = await jsonOrThrow(res);
  return fromApiProject(data);
}

export async function apiPatchProject(id, patch) {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiPatch(patch)),
  });
  const data = await jsonOrThrow(res);
  return fromApiProject(data);
}

export async function apiDeleteProject(id) {
  // Tu middleware hace soft-delete (active:false)
  const res = await fetch(`${API}/projects/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return true;
}

export async function apiListTasksByProject(projectId) {
  const res = await fetch(`${API}/tasks?projectId=${projectId}`, { cache: "no-store" });
  return jsonOrThrow(res);
}
export async function apiCreateTask(payload) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
}
export async function apiPatchTask(id, patch) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return jsonOrThrow(res);
}
export async function apiDeleteTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}
