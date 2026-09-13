import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "@/context/AuthContext"
import { useFavorites } from "@/context/FavoritesContext"

export function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useFavorites()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-[#7c3aed] flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21a9 9 0 009-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 009 9z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3v18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14c2.5 0 4.5-2 4.5-4.5S14.5 5 12 5s-4.5 2-4.5 4.5 2 4.5 4.5 4.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 shrink-0">
              Moksha <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30">STUDIO</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-0.5 min-w-0">
            <Link to="/" className="px-3 py-1.5 text-xs font-medium text-white bg-white/10 rounded-md flex items-center gap-1.5 border border-white/10 shadow-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
              Products
            </Link>
            <a href="#" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors whitespace-nowrap">Stories</a>
            <a href="#" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors whitespace-nowrap">Membership</a>
            <a href="#" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors whitespace-nowrap">Artisans</a>
            {user && (
              <>
                <Link to="/orders" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors whitespace-nowrap">Orders</Link>
                <Link to="/support" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors whitespace-nowrap">AI Concierge</Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link to="/admin/products/add" className="px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-100 hover:bg-white/5 rounded-md transition-colors border border-amber-500/20 whitespace-nowrap">
                Add Product
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden xl:flex items-center relative w-48">
            <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-surface-elevated text-xs text-slate-200 pl-8 pr-10 py-1.5 rounded-lg border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-500"
              placeholder="Search..."
              type="text"
            />
            <kbd className="absolute right-2 top-1 text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-white/10 text-slate-400 border border-white/10">⌘K</kbd>
          </div>
          <button type="button" className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors relative">
            <svg className={`w-5 h-5 ${count > 0 ? "fill-brand-400 text-brand-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{count}</span>
            )}
          </button>
          <Link to="/cart" className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">2</span>
          </Link>
          {user ? (
            <button
              onClick={() => { logout(); navigate("/") }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-[#6b58e7] text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-brand-600/20 transition-all"
            >
              <span className="hidden sm:inline">Logout</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-[#6b58e7] text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-brand-600/20 transition-all">
              <span className="hidden sm:inline">Sign In</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
