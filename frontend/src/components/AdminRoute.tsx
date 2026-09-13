import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

import { useAuth } from "@/context/AuthContext"

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return user?.role === "admin" ? <>{children}</> : <Navigate to="/" />
}
