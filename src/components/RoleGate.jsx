"use client";
import { useAuth } from "@/contexts/AuthContext.jsx";

export default function RoleGate({ allow = [], children }) {
  const { user } = useAuth();
  if (!user) return null;
  return allow.includes(user.role) ? <>{children}</> : null;
}
