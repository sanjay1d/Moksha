import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { api } from "@/services/api"
import { useAuth } from "@/context/AuthContext"
import { useFavorites } from "@/context/FavoritesContext"
import { resolveImageUrl } from "@/utils/imageUrl"
import type { Product } from "@/types"

const badgePresets = [
  { label: "Member Reserve", className: "bg-brand-600/90 border-brand-400/30" },
  { label: "Low Stock · 8 Left", className: "bg-rose-500/80 border-rose-400/30" },
  { label: "Best Seller", className: "bg-emerald-500/80 border-emerald-400/30" },
  { label: "Artisan Crafted", className: "bg-brand-600/90 border-brand-400/30" },
  { label: "Organic Certified", className: "bg-white/10 border-white/15" },
  { label: "New Arrival", className: "bg-indigo-500/80 border-indigo-400/30" },
]

const categories = [
  "All Objects",
  "Ceramics & Homeware",
  "Botanical Fragrance",
  "Loom & Textiles",
  "Mindful Workspace",
]

export function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All Objects")
  const [addingId, setAddingId] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const { isFavorite, toggle } = useFavorites()
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [])

  const imageUrl = (product: Product) =>
    resolveImageUrl(product.image_url, "https://placehold.co/600x400/1b1f2c/c2c1ff?text=Moksha")

  const addToBag = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    if (!user) {
      navigate("/login")
      return
    }
    setAddingId(product.id)
    try {
      await api.post("/cart", { product_id: product.id, quantity: 1 })
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => setAddingId(null), 1400)
    }
  }

  const query = (searchParams.get("q") || "").toLowerCase()

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "All Objects" ||
        p.description?.toLowerCase().includes(activeCategory.toLowerCase())
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, query])

  return (
    <div className="min-h-screen bg-surface-base text-slate-100 font-sans antialiased selection:bg-brand-600 selection:text-white flex flex-col relative overflow-x-hidden">
      <div className="glow-ambient-top pointer-events-none fixed inset-0 z-0 h-[600px] w-full"></div>

      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <section className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-brand-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Curated Release · Edition No. 04
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Curated essentials for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">mindful living</span>.
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl font-light">
            Reconnecting tactile craftsmanship with quiet luxury. Explore certified sustainable wares, limited kiln batches, and bespoke artisan selections.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-8 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                    activeCategory === c
                      ? "bg-white text-surface-base shadow-sm"
                      : "text-slate-300 hover:text-white bg-surface-elevated hover:bg-surface-highlight border border-white/5"
                  }`}
                >
                  {c} {c === "All Objects" && `(${products.length})`}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-lg bg-surface-elevated border border-white/10 shrink-0">
              <button type="button" className="p-1.5 rounded text-white bg-white/10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
              <button type="button" className="p-1.5 rounded text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated border border-white/10 text-slate-300 hover:border-brand-500/50 transition">
                <span>Price Range</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
              <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated border border-white/10 text-slate-300 hover:border-brand-500/50 transition">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                In Stock Only
              </button>
              <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated border border-white/10 text-slate-300 hover:border-brand-500/50 transition">
                Edition Batch: 2025.1
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-normal">Sort by:</span>
              <select className="bg-surface-elevated border-white/10 rounded-lg text-slate-200 text-xs py-2 pl-3 pr-8 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer border">
                <option>Featured Curation</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Additions</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>
        </section>

        {/* Search result info */}
        {query && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-300">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <span className="text-brand-400 font-medium">"{searchParams.get("q")}"</span>
            </p>
            <button
              onClick={() => setSearchParams({})}
              type="button"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading ? (
            <p className="col-span-full text-slate-400 text-sm">Loading curated objects…</p>
          ) : (
            filtered.map((product, i) => {
              const badge = badgePresets[i % badgePresets.length]
              return (
                <article key={product.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300">
                  <Link to={`/products/${product.id}`} className="relative h-64 w-full bg-[#1b1f2c] overflow-hidden">
                    <img
                      src={imageUrl(product)}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold backdrop-blur-md text-white border tracking-wide ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.id) }}
                      type="button"
                      className={`absolute top-3 right-3 p-2 rounded-lg bg-surface-base/70 backdrop-blur-md border border-white/10 transition ${
                        isFavorite(product.id)
                          ? "text-brand-400 border-brand-500/30"
                          : "text-slate-300 hover:text-white hover:bg-white/20"
                      }`}
                      aria-label={isFavorite(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <svg className={`w-4 h-4 ${isFavorite(product.id) ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </Link>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span>Curated Object</span>
                        <div className="flex items-center gap-1 text-amber-400 font-medium">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{(4.5 + (i % 6) / 10).toFixed(1)}</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block font-normal">Price</span>
                        <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={(e) => addToBag(e, product)}
                        disabled={addingId === product.id}
                        type="button"
                        className={`px-4 py-2 rounded-lg text-white text-xs font-semibold border transition-all shadow-sm ${
                          addingId === product.id
                            ? "bg-emerald-600 border-transparent"
                            : "bg-surface-elevated hover:bg-brand-600 border-white/10 hover:border-transparent"
                        }`}
                      >
                        {addingId === product.id ? "Added ✓" : "Add to Bag"}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </section>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="mt-14 mb-16 flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-slate-400">Showing {Math.min(filtered.length, products.length)} of {products.length} handcrafted objects</p>
            <div className="w-48 h-1 bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: "25%" }}></div>
            </div>
            <button type="button" className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-white/10 text-xs font-semibold text-white tracking-wide transition-all shadow-lg hover:shadow-brand-600/10">
              <span>Load More Curated Goods</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        )}

        {/* Trust */}
        <section className="rounded-2xl bg-[#131622] border border-white/[0.07] p-8 lg:p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="glow-ambient-card absolute inset-0 pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Mindful Shipping", text: "Carbon neutral door-to-door delivery on all orders above $150.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
              { title: "Artisan Provenance", text: "Every piece arrives with numbered certificate of origin and lineage.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "30-Day Return Cycle", text: "Quiet trial period with hassle-free doorstep collection guarantees.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
              { title: "256-Bit Encrypted", text: "Bank-grade vault security powering all transaction gateways.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-surface-base text-slate-400 text-xs mt-auto pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">M</div>
                <span className="text-base font-bold tracking-tight text-white">Moksha Store</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Curated objects, sensory rituals, and heirloom living materials created in limited quantities with international master craftspeople.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] text-slate-400">Secure 256-Bit Encrypted Portal · Moksha Store Global</span>
              </div>
            </div>
            {[
              { title: "Catalog", links: ["Ceramics", "Botanicals", "Loom Textiles", "Workspace Tools", "Archival Sets"] },
              { title: "Studio", links: ["Philosophy", "Master Artisans", "Sustainability Guarantee", "Journal & Stories", "Store Locator"] },
              { title: "Patron Care", links: ["Order Tracking", "Member Support", "Ceramic Care Guide", "Terms of Service", "Privacy Policy"] },
            ].map((col) => (
              <div key={col.title} className="space-y-3">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200">{col.title}</h5>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2025 Moksha Store Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300 transition">Store Locator</a>
              <a href="#" className="hover:text-slate-300 transition">Sustainability Guarantee</a>
              <a href="#" className="hover:text-slate-300 transition">Patron Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
