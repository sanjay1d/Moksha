import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: string[]
  toggle: (productId: string) => void
  isFavorite: (productId: string) => boolean
  count: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggle = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider")
  return context
}
