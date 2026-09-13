import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  picture?: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (stored && storedUser) {
      setToken(stored)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const setAuth = (token: string, user: User) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
