export default function HomePage() {
  return (
    <main style={{padding: "1.5rem"}}>
      <h1>Sistema de Gestión de Proyectos</h1>
      <p>Base lista. Vamos a agregar autenticación y roles.</p>

      <nav style={{marginTop: 12}}>
        <a href="/login" style={{marginRight: 12}}>Login</a>
        <a href="/register" style={{marginRight: 12}}>Registro</a>
        <a href="/dashboard">Dashboard</a>
      </nav>
    </main>
  );
}
