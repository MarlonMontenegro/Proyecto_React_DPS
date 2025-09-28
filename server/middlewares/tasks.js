function registerTasks(server, router) {
  const db = router.db; // lowdb
  const now = () => new Date().toISOString();

  function projectExists(id) {
    return !!db
      .get("projects")
      .find({ id: Number(id) })
      .value();
  }

  // CREATE: POST /api/tasks
  server.post("/api/tasks", (req, res, next) => {
    const { title, projectId, done } = req.body || {};

    // title obligatorio
    if (!title || typeof title !== "string" || !title.trim()) {
      return res
        .status(400)
        .jsonp({ error: "Task.title es obligatorio (string no vacío)" });
    }

    // projectId obligatorio y debe existir
    const pid = Number(projectId);
    if (!Number.isFinite(pid) || !projectExists(pid)) {
      return res
        .status(400)
        .jsonp({ error: "Task.projectId debe referir a un project existente" });
    }

    // done  debe ser booleano
    if (done !== undefined && typeof done !== "boolean") {
      return res.status(400).jsonp({ error: "Task.done debe ser booleano" });
    }

    req.body.title = title.trim();
    req.body.projectId = pid;
    if (done === undefined) req.body.done = false;
    req.body.createdAt = now();
    req.body.updatedAt = req.body.createdAt;

    next();
  });

  // UPDATE parcial: PATCH /api/tasks/:id
  server.patch("/api/tasks/:id", (req, res, next) => {
    if (req.body && "title" in req.body) {
      const t = req.body.title;
      if (!t || typeof t !== "string" || !t.trim()) {
        return res
          .status(400)
          .jsonp({ error: "Task.title no puede ser vacío" });
      }
      req.body.title = t.trim();
    }

    // projectId debe existir
    if (req.body && "projectId" in req.body) {
      const pid = Number(req.body.projectId);
      if (!Number.isFinite(pid) || !projectExists(pid)) {
        return res.status(400).jsonp({
          error: "Task.projectId debe referir a un project existente",
        });
      }
      req.body.projectId = pid;
    }

    // done debe ser booleano
    if (req.body && "done" in req.body && typeof req.body.done !== "boolean") {
      return res.status(400).jsonp({ error: "Task.done debe ser booleano" });
    }

    // timestamp de última actualización
    req.body.updatedAt = now();

    next();
  });
}

module.exports = { registerTasks };