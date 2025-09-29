export default function HomePage() {
  return (
    <main style={{ padding: "1.5rem", fontFamily: "Arial, sans-serif" }}>
      {/* Encabezado */}
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Sistema de Gestión de Proyectos
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Organiza tus tareas, colabora y logra resultados.
        </p>
      </header>

      {/* session de cuadros */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            color: "#000",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem", color: "#00796B" }}>
            📊 Progreso
          </h2>
          <p>Visualiza el avance de tus proyectos en tiempo real.</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            color: "#000",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem", color: "#00796B" }}>
            ⚡ Productividad
          </h2>
          <p>Optimiza tu tiempo y concéntrate en lo importante.</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            color: "#000",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem", color: "#00796B" }}>
            🤝 Colaboración
          </h2>
          <p>Trabaja en equipo y comparte actualizaciones fácilmente.</p>
        </div>
      </section>

      {/* Cuadro de Notificaciones centrado */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            color: "#000",
            textAlign: "center",
            width: "300px",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem", color: "#00796B" }}>
            🔔 Notificaciones
          </h2>
          <p>Mantente informado con alertas en tiempo real.</p>
        </div>
      </section>

      {/* Footer con redes sociales */}
      <footer
        style={{
          textAlign: "center",
          padding: "1.5rem",
          borderTop: "1px solid #ddd",
          color: "#555",
        }}
      >
        <p>© {new Date().getFullYear()} Pagina de proyectos y tareas — Todos los derechos reservados</p>
        <div style={{ marginTop: "0.8rem" }}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: 12 }}
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: 12 }}
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
