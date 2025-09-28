import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext.jsx";


export const metadata = {
  title: "Project Manager",
  description: "Gestor de proyectos con Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div style={{ maxWidth: 920, margin: "0 auto", padding: "1.5rem" }}>
            <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <a href="/" style={{ fontWeight: 700 }}>ProjectManager</a>
              <nav style={{ display: "flex", gap: 12, fontSize: 14 }}>
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/login">Login</a>
                <a href="/register">Registro</a>
              </nav>
            </header>
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
