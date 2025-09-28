"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const USERS_KEY = "pm_users";
const SESSION_KEY = "pm_session";

function safeGet(key) {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function safeSet(key, value) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function safeRemove(key) {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); } catch {}
}
function uid() { return Math.random().toString(36).slice(2, 10); }

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar sesión si existe
  useEffect(() => {
    const session = safeGet(SESSION_KEY);
    const users = safeGet(USERS_KEY) ?? [];
    if (session?.userId) {
      const u = users.find(x => x.id === session.userId);
      if (u) setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
    }
  }, []);

  async function login(email, password) {
    const users = safeGet(USERS_KEY) ?? [];
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, message: "Credenciales inválidas" };
    safeSet(SESSION_KEY, { userId: found.id, issuedAt: Date.now() });
    setUser({ id: found.id, name: found.name, email: found.email, role: found.role });
    return { ok: true };
  }

  async function register({ name, email, password, role }) {
    const users = safeGet(USERS_KEY) ?? [];
    if (users.some(u => u.email === email)) {
      return { ok: false, message: "Ese correo ya está registrado" };
    }
    const newU = { id: uid(), name, email, password, role };
    safeSet(USERS_KEY, [...users, newU]);
    safeSet(SESSION_KEY, { userId: newU.id, issuedAt: Date.now() });
    setUser({ id: newU.id, name, email, role });
    return { ok: true };
  }

  function logout() {
    safeRemove(SESSION_KEY);
    setUser(null);
  }

  const value = useMemo(() => ({
    user, isAuthenticated: !!user, login, register, logout
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
