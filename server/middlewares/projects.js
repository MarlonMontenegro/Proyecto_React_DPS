function registerProjects(server, router) {
  const db = router.db; // lectura/escritura directa sobre db.json
  const now = () => new Date().toISOString();

  // ===== CREATE: POST /api/projects =====
  server.post("/api/projects", (req, res, next) => {
    const { name, description, active } = req.body || {};

    // 'name' obligatorio, string y no vacío
    if (!name || typeof name !== "string" || !name.trim()) {
      return res
        .status(400)
        .jsonp({ error: "Project.name es obligatorio (string no vacío)" });
    }

    // 'active' si se envía, debe ser booleano
    if (active !== undefined && typeof active !== "boolean") {
      return res
        .status(400)
        .jsonp({ error: "Project.active debe ser booleano" });
    }

    // Normalización
    req.body.name = name.trim();
    if (typeof description === "string") {
      req.body.description = description.trim();
    }

    // Default para 'active'
    if (active === undefined) {
      req.body.active = true;
    }

    // Timestamps
    req.body.createdAt = now();
    req.body.updatedAt = req.body.createdAt;

    // Delegar al router
    next();
  });

  // ===== UPDATE: PATCH /api/projects/:id =====

  server.patch("/api/projects/:id", (req, res, next) => {
    // 'active' debe ser booleano
    if (
      req.body &&
      "active" in req.body &&
      typeof req.body.active !== "boolean"
    ) {
      return res
        .status(400)
        .jsonp({ error: "Project.active debe ser booleano" });
    }

    // 'name' no puede quedar vacío
    if (req.body && "name" in req.body) {
      const n = req.body.name;
      if (!n || typeof n !== "string" || !n.trim()) {
        return res
          .status(400)
          .jsonp({ error: "Project.name no puede ser vacío" });
      }
      req.body.name = n.trim();
    }

    //  normaliza
    if (
      req.body &&
      "description" in req.body &&
      typeof req.body.description === "string"
    ) {
      req.body.description = req.body.description.trim();
    }

    // Timestamp de última actualización
    req.body.updatedAt = now();

    next();
  });

  // ===== SOFT DELETE: DELETE /api/projects/:id =====

  server.delete("/api/projects/:id", (req, res) => {
    const id = Number(req.params.id);
    const project = db.get("projects").find({ id }).value();

    if (!project) {
      return res.status(404).jsonp({ error: "Project no encontrado" });
    }

    // si ya está inactivo, devuelve el mismo
    if (project.active === false) {
      return res.status(200).jsonp(project);
    }

    const updated = db
      .get("projects")
      .find({ id })
      .assign({ active: false, updatedAt: now() })
      .write();

    // evitamos que el router haga un delete físico
    return res.status(200).jsonp(updated);
  });
}

module.exports = { registerProjects };
