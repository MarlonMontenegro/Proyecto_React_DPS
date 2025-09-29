import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import Link from "next/link";

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
              {/* ⬇️ navegación interna con Link */}
              <Link href="/" style={{ fontWeight: 700 }}>ProjectManager</Link>
              <nav style={{ display: "flex", gap: 12, fontSize: 14 }}>
                <Link href="/">Home</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/login">Login</Link>
                <Link href="/register">Registro</Link>
              </nav>
            </header>
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
