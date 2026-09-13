import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useAuth } from "@/context/AuthContext"
import { useFavorites } from "@/context/FavoritesContext"
import { api } from "@/services/api"
import { resolveImageUrl } from "@/utils/imageUrl"
import type { Product } from "@/types"

const thumbnails = [
  { id: "main", label: "Lifestyle View" },
  { id: "detail1", label: "Texture Close-up" },
  { id: "detail2", label: "Eyewear Focus" },
  { id: "box", label: "Atelier Packaging" },
]

const colorways = [
  { name: "Saffron Amber & Gold", className: "bg-amber-500" },
  { name: "Obsidian Smoke", className: "bg-slate-900 border-white/20" },
  { name: "Raw Kyoto Natural", className: "bg-stone-300 border-white/20" },
]

const sizes = ["S (55–56 cm)", "M (57–58 cm)", "L (59–60 cm)"]

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorways[0].name)
  const [selectedSize, setSelectedSize] = useState(sizes[1])
  const [selectedThumb, setSelectedThumb] = useState("main")
  const [adding, setAdding] = useState(false)
  const { user } = useAuth()
  const { isFavorite, toggle } = useFavorites()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then((res) => setProduct(res.data))
    }
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen bg-[#090c15] text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Loading object…</p>
      </div>
    )
  }

  const imageUrl = resolveImageUrl(product.image_url, "https://placehold.co/800x500/111624/c2c1ff?text=Moksha")

  const displayImage =
    selectedThumb === "main"
      ? imageUrl
      : imageUrl

  const memberPrice = product.price * 0.82

  const updateQty = (delta: number) => {
    const next = quantity + delta
    if (next >= 1 && next <= product.stock) setQuantity(next)
  }

  const addToCart = async () => {
    if (!user) return navigate("/login")
    if (!id) return
    setAdding(true)
    try {
      await api.post("/cart", { product_id: id, quantity })
      setMessage("Allocated to Bag")
      setTimeout(() => setMessage(""), 2000)
    } catch {
      setMessage("Failed to add to cart")
    } finally {
      setTimeout(() => setAdding(false), 1800)
    }
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white bg-[#090c15]" style={{ backgroundImage: "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%), radial-gradient(at 100% 25%, rgba(129, 140, 248, 0.08) 0px, transparent 40%), radial-gradient(at 50% 100%, rgba(67, 56, 202, 0.15) 0px, transparent 60%)", backgroundAttachment: "fixed" }}>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <button onClick={() => navigate(-1)} className="hover:text-indigo-400 flex items-center gap-1.5 transition">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Back to Catalog
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-indigo-400 transition">Curated Objects</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left gallery */}
          <section className="lg:col-span-7 flex flex-col gap-5">
            <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/[0.09] shadow-2xl group">
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0a0d14]/80 backdrop-blur-md text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Curated Atelier Release
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0a0d14]/80 backdrop-blur-md text-slate-200 border border-white/10 shadow-lg">
                  {product.stock} in Batch
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 backdrop-blur-md">
                  BATCH #2025.2
                </span>
              </div>
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] max-h-[560px] overflow-hidden bg-gradient-to-tr from-amber-950/20 via-brand-dark to-slate-900 flex items-center justify-center">
                <img src={displayImage} alt={product.name} className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between text-xs text-slate-300/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  Master Artisan · Atelier Verified
                </span>
                <span className="text-slate-400 text-[11px]">Limited Edition Release</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 overflow-x-auto pb-2 custom-scrollbar">
              {thumbnails.map((thumb) => (
                <button
                  key={thumb.id}
                  onClick={() => setSelectedThumb(thumb.id)}
                  type="button"
                  title={thumb.label}
                  className={`thumb-btn flex-shrink-0 w-24 h-20 rounded-2xl overflow-hidden glass-panel transition-all focus:outline-none ${
                    selectedThumb === thumb.id
                      ? "border-2 border-indigo-500 ring-2 ring-indigo-500/20"
                      : "border border-white/10 hover:border-indigo-400/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imageUrl} alt={thumb.label} className="w-full h-full object-cover" />
                  {selectedThumb === thumb.id && <span className="absolute inset-0 bg-indigo-600/10"></span>}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Kyoto Heritage", sub: "Pure plant-dyed straw" },
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Provenance Seal", sub: "Signed edition certificate" },
                { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", title: "Zero Plastic", sub: "Shipped in bespoke cedar" },
              ].map((prop) => (
                <div key={prop.title} className="p-3.5 rounded-2xl glass-panel text-center">
                  <svg className="w-5 h-5 mx-auto text-indigo-400 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d={prop.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                  <p className="text-xs font-semibold text-slate-200">{prop.title}</p>
                  <p className="text-[11px] text-slate-400">{prop.sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Right details */}
          <section className="lg:col-span-5 flex flex-col">
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Atelier Series 04</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">Limited Kiln Release</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight leading-snug mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg key={index} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-semibold text-slate-200">4.92</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-indigo-400 hover:underline cursor-pointer">84 Verified Patron Critiques</span>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] mb-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Patron Offering</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-slate-500 line-through">${(product.price * 1.35).toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {product.stock > 0 ? "In Atelier Stock" : "Out of Stock"}
                  </span>
                  <p className="text-xs text-indigo-300/80 mt-1">Free Priority Courier</p>
                </div>
              </div>
              <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">★</span>
                  <span className="text-xs text-slate-300">Studio Member Price:</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-indigo-300">${memberPrice.toFixed(2)}</span>
                  <span className="text-[11px] text-slate-400">(Save ${(product.price - memberPrice).toFixed(2)})</span>
                </div>
              </div>
            </div>

            {product.stock > 0 && product.stock <= 20 && (
              <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span className="text-xs font-medium text-amber-200">
                    Scarcity alert: <strong className="font-semibold text-amber-100">{product.stock} units</strong> remaining in atelier
                  </span>
                </div>
                <span className="text-[11px] text-amber-300/70">Batch 2025.2</span>
              </div>
            )}

            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            <div className="space-y-5 mb-8">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Colorway / Tint</label>
                  <span className="text-xs text-indigo-400 font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {colorways.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      type="button"
                      title={c.name}
                      className={`color-chip w-9 h-9 rounded-full ${c.className} ring-offset-2 ring-offset-[#0a0d14] transition ${
                        selectedColor === c.name ? "ring-2 ring-indigo-500" : "hover:scale-105"
                      }`}
                    >
                      <span className="sr-only">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Bespoke Fit / Size</label>
                  <span className="text-xs text-indigo-400 hover:underline cursor-pointer">View Sizing Guide</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      type="button"
                      className={`py-2.5 rounded-xl text-xs font-semibold transition text-center ${
                        selectedSize === size
                          ? "border-2 border-indigo-500 bg-indigo-500/10 text-white shadow-glow-sm"
                          : "border border-white/10 text-slate-300 hover:border-indigo-400/50 glass-panel"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2.5">Curated Quantity</label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="flex items-center justify-between rounded-xl glass-input px-3 py-2 border border-white/15 w-full sm:w-36">
                    <button onClick={() => updateQty(-1)} type="button" aria-label="Decrease quantity" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                    <span className="font-bold text-sm text-white select-none">{quantity}</span>
                    <button onClick={() => updateQty(1)} type="button" aria-label="Increase quantity" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={addToCart}
                    disabled={adding || product.stock === 0}
                    className={`flex-grow py-3.5 px-6 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 group active:scale-[0.98] ${
                      adding
                        ? "bg-emerald-600"
                        : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-brand-700 hover:from-indigo-400 hover:via-indigo-500 hover:to-indigo-600 shadow-glow hover:shadow-glow-lg"
                    }`}
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>{adding ? "Allocated to Bag (✓)" : "Add to Cart"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button onClick={() => navigate("/cart")} type="button" className="flex-1 py-3 px-4 rounded-xl glass-panel border border-white/10 hover:border-indigo-400/40 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition">
                  <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.03.63-2.67 1.38-.57.65-1.07 1.71-.93 2.74 1.03.08 2.07-.5 2.68-1.25z" />
                  </svg>
                  Express 1-Click Purchase
                </button>
                <button
                  onClick={() => id && toggle(id)}
                  type="button"
                  className={`p-3 rounded-xl glass-panel border transition ${
                    id && isFavorite(id)
                      ? "border-brand-500/40 text-brand-400"
                      : "border-white/10 hover:border-indigo-400/40 text-slate-300 hover:text-white"
                  }`}
                  title={id && isFavorite(id) ? "Saved to Patron Wishlist" : "Save to Patron Wishlist"}
                >
                  <svg className={`w-5 h-5 ${id && isFavorite(id) ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>

            {message && (
              <p className={`mb-4 text-sm ${message.includes("Bag") ? "text-emerald-400" : "text-rose-400"}`}>{message}</p>
            )}

            <div className="border-t border-white/[0.08] divide-y divide-white/[0.06] text-xs">
              {[
                { title: "Artisan Lineage & Materials", content: "Every piece is numbered and signed by master artisans. Created through a rigorous manual curing process honoring traditional methods." },
                { title: "Dimensions & Care Rituals", content: "Clean with the provided organic silk cloth and store in the moisture-controlled cedar box for lasting preservation." },
                { title: "Carbon Neutral Courier & Quiet Returns", content: "Dispatched from our ateliers within 24 hours. Includes carbon offset tracking and 30-day quiet returns." },
              ].map((item) => (
                <details key={item.title} className="group py-3.5" open>
                  <summary className="flex items-center justify-between font-semibold text-slate-200 cursor-pointer list-none select-none">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {item.title}
                    </span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </span>
                  </summary>
                  <div className="pt-3 text-slate-400 leading-relaxed">
                    <p>{item.content}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Trust banner */}
        <section className="mt-16 py-8 px-6 rounded-3xl glass-panel border border-white/[0.08]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { title: "Direct Atelier Lineage", sub: "Fair compensation to master artisans" },
              { title: "Carbon-Neutral Journey", sub: "100% offset transit and plastic-free box" },
              { title: "30-Day Quiet Returns", sub: "Complimentary collection worldwide" },
              { title: "Provenance Inscribed", sub: "Verified serial and authenticity wax seal" },
            ].map((t) => (
              <div key={t.title} className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center font-bold text-xs">1</div>
                <h4 className="text-sm font-semibold text-white">{t.title}</h4>
                <p className="text-xs text-slate-400">{t.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-white/[0.08] bg-[#07090f]/90 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">M</div>
              <span className="text-sm font-semibold text-slate-200">Moksha Craft & Design Studio</span>
              <span className="text-slate-600">·</span>
              <span>© 2025 All rights reserved.</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <a href="#" className="hover:text-indigo-400 transition">Provenance Index</a>
              <a href="#" className="hover:text-indigo-400 transition">Artisan Grants</a>
              <a href="#" className="hover:text-indigo-400 transition">Atelier Registry</a>
              <a href="#" className="hover:text-indigo-400 transition">Privacy & Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
