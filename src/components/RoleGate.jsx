"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleGate({ allow = [], children }) {
  const { user } = useAuth();
  if (!user) return null;
  return allow.includes(user.role) ? <>{children}</> : null;
}
