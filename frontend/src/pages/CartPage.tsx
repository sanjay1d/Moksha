import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { api } from "@/services/api"
import { resolveImageUrl } from "@/utils/imageUrl"
import type { Cart, Product } from "@/types"

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

const recommendations: { name: string; sub: string; tag: string; price: number; icon: string }[] = [
  { name: "Hinoki Wood Bath Elixir", sub: "Cold-pressed Japanese cypress oil.", tag: "Botanicals", price: 42, icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { name: "Autumnal Botanical Diffuser", sub: "Smoked amber & cedar needles.", tag: "Atmosphere", price: 48, icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
  { name: "Atelier Monograph Vol. 03", sub: "Heavyweight tactile photography book.", tag: "Studio Print", price: 36, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { name: "Stoneware Conditioning Balm", sub: "Beeswax & camellia matte finish butter.", tag: "Ceramic Care", price: 22, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
]

export function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [showInscription, setShowInscription] = useState(false)
  const [showPromo, setShowPromo] = useState(false)
  const [timer, setTimer] = useState(14 * 60 + 45)

  const fetchCart = async () => {
    const res = await api.get("/cart")
    setCart(res.data)
    const ids = res.data.items.map((i: { product_id: string }) => i.product_id)
    const productRes = await api.get("/products")
    const productMap: Record<string, Product> = {}
    productRes.data.forEach((p: Product) => {
      if (ids.includes(p.id)) productMap[p.id] = p
    })
    setProducts(productMap)
  }

  useEffect(() => {
    fetchCart()
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(interval)
  }, [])

  const subtotal = useMemo(() => {
    if (!cart) return 0
    return cart.items.reduce((sum, item) => {
      const p = products[item.product_id]
      return sum + (p?.price || 0) * item.quantity
    }, 0)
  }, [cart, products])

  const discount = 0
  const total = subtotal - discount
  const uniqueCount = cart?.items.length || 0

  const updateQuantity = async (productId: string, delta: number) => {
    const item = cart?.items.find((i) => i.product_id === productId)
    if (!item) return
    const next = item.quantity + delta
    if (next < 1) return
    await api.post("/cart", { product_id: productId, quantity: next })
    fetchCart()
  }

  const remove = async (productId: string) => {
    await api.delete(`/cart/${productId}`)
    fetchCart()
  }

  const checkout = async () => {
    try {
      const orderRes = await api.post("/orders")
      const order = orderRes.data
      const checkoutRes = await api.post("/payments/checkout", { order_id: order.id })
      window.location.href = checkoutRes.data.url
    } catch {
      alert("Failed to start checkout")
    }
  }

  const imageUrl = (p?: Product) =>
    resolveImageUrl(p?.image_url, "https://placehold.co/600x400/1b1f2c/c2c1ff?text=Moksha")

  if (!cart) {
    return (
      <div className="min-h-screen bg-brand-bg text-slate-100 flex items-center justify-center">
        <p className="text-brand-muted">Loading atelier tray…</p>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">Your curated bag is empty.</p>
        <Link to="/" className="px-6 py-2 bg-gradient-to-r from-brand-accent to-indigo-600 rounded-xl text-white text-sm font-semibold">
          Discover Objects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen ambient-glow bg-brand-bg text-slate-100 font-sans antialiased selection:bg-brand-accent selection:text-white flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-brand-surfaceBorder/80">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Curated Bag</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{uniqueCount} Unique Works</span>
              </div>
              <p className="mt-1.5 text-xs text-brand-muted flex items-center gap-2">
                <span>Atelier Release 2025.2</span>
                <span>•</span>
                <span className="flex items-center text-brand-gold gap-1 font-medium">
                  <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <polyline points="12 6 12 12 16 14" strokeWidth="2" />
                  </svg>
                  Items held in your atelier private tray for <span className="font-mono font-bold text-white">{formatTime(timer)}</span>
                </span>
              </p>
            </div>
            <div className="w-full md:w-80 bg-brand-surface/90 border border-brand-surfaceBorder rounded-2xl p-3.5 shadow-sm">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  Complimentary Priority Courier
                </span>
                <span className="text-emerald-400 font-semibold text-[11px]">Unlocked</span>
              </div>
              <div className="w-full bg-brand-bg rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full w-full"></div>
              </div>
              <p className="text-[11px] text-brand-muted mt-2">Member status unlocks carbon-neutral express freight on all atelier consignments.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const product = products[item.product_id]
                const img = imageUrl(product)
                return (
                  <article key={item.product_id} className="bg-brand-surface/95 border border-brand-surfaceBorder hover:border-brand-accent/40 rounded-2xl p-5 md:p-6 transition-all duration-300 shadow-card-elevation relative group">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="relative w-full sm:w-36 h-40 sm:h-44 rounded-xl overflow-hidden bg-[#1f2433] flex-shrink-0 border border-brand-surfaceBorder">
                        {img ? (
                          <img src={img} alt={product?.name || "Product"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#251e18] via-[#3a2e1d] to-[#593d18] flex flex-col items-center justify-center p-3 relative">
                            <svg className="w-14 h-14 text-amber-300/80 mb-1" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                              <path d="M2 17c3.5 0 6.5-2.5 10-2.5s6.5 2.5 10 2.5M6 14.5c.5-3 2-8 6-8s5.5 5 6 8" strokeLinecap="round" />
                            </svg>
                            <span className="text-[9px] font-bold text-amber-200 tracking-wider uppercase text-center">Atelier</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">Curated Edition</span>
                                <span className="w-1 h-1 rounded-full bg-brand-muted"></span>
                                <span className="text-[11px] text-brand-muted">Batch #2025.2</span>
                              </div>
                              <h2 className="text-lg font-bold text-white mt-1 group-hover:text-indigo-200 transition-colors">{product?.name || item.product_id}</h2>
                              <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">{product?.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">${((product?.price || 0) * item.quantity).toFixed(2)}</div>
                              <div className="text-xs text-brand-muted">Qty {item.quantity}</div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#1a1f2e] text-slate-300 border border-brand-surfaceBorder">Edition: 2025.2</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-accent/20 text-indigo-300 border border-brand-accent/30">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                              </svg>
                              In Stock
                            </span>
                          </div>
                        </div>
                        <div className="mt-5 pt-4 border-t border-brand-surfaceBorder/60 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center space-x-2.5 bg-[#0e111a] border border-brand-surfaceBorder rounded-xl p-1">
                            <button onClick={() => updateQuantity(item.product_id, -1)} type="button" className="w-7 h-7 flex items-center justify-center rounded-lg text-brand-muted hover:text-white hover:bg-brand-surface border border-transparent hover:border-brand-surfaceBorder transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                            <span className="font-mono font-semibold text-xs px-2 text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product_id, 1)} type="button" className="w-7 h-7 flex items-center justify-center rounded-lg text-brand-muted hover:text-white hover:bg-brand-surface border border-transparent hover:border-brand-surfaceBorder transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center space-x-4 text-xs font-medium">
                            <button type="button" className="text-brand-muted hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                              Save for Later
                            </button>
                            <span className="text-brand-surfaceBorder">|</span>
                            <button onClick={() => remove(item.product_id)} type="button" className="text-rose-400/80 hover:text-rose-400 flex items-center gap-1.5 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="bg-brand-surfaceAlt/80 border border-brand-surfaceBorder rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input id="gift-box" defaultChecked className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent bg-brand-bg border-brand-surfaceBorder cursor-pointer" type="checkbox" />
                  <label htmlFor="gift-box" className="text-sm font-semibold text-white cursor-pointer select-none">
                    Archival Cedar Gift Chest Packaging & Provenance Letter
                  </label>
                </div>
                <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">Complimentary</span>
              </div>
              <p className="text-xs text-brand-muted pl-7">
                Each item is nestled into shredded organic washi paper inside a reusable charred cedar box, authenticated with an artisan hand-embossed wax sigil.
              </p>
              <div className="pt-2 pl-7">
                <button onClick={() => setShowInscription(!showInscription)} type="button" className="text-xs font-medium text-brand-accent hover:text-brand-accentLight flex items-center gap-1">
                  <span>+ Add personalised atelier inscription or calligraphic gift note</span>
                </button>
                {showInscription && (
                  <textarea className="mt-3 w-full bg-[#0e121c] border border-brand-surfaceBorder rounded-xl p-3 text-xs text-slate-200 placeholder-brand-muted focus:outline-none focus:border-brand-accent" placeholder="Write your words for the calligrapher…" rows={2} />
                )}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-brand-surface/95 border border-brand-surfaceBorder rounded-3xl p-6 shadow-card-elevation backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none"></div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-between border-b border-brand-surfaceBorder/80 pb-4">
                <span>Order Investment</span>
                <span className="text-xs font-normal text-brand-muted uppercase tracking-widest">USD</span>
              </h2>
              <div className="mt-5 space-y-3.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Atelier Subtotal ({uniqueCount} pieces)</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="flex items-center gap-1">
                    <span>Studio Patron Member Privilege</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/10 border border-emerald-500/20 rounded">Applied</span>
                  </span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">Priority Courier (Carbon Neutral)</span>
                  <span className="font-medium text-emerald-400 uppercase tracking-wider text-[11px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Import Tariffs & Atelier Assurance</span>
                  <span>Calculated at Next Step</span>
                </div>
                <div className="pt-4 border-t border-brand-surfaceBorder/80 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-white block">Total Investment</span>
                    <span className="text-[10px] text-brand-muted">Includes direct artisan royalties</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white tracking-tight">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={checkout} type="button" className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-accent via-indigo-600 to-brand-accentHover hover:from-brand-accentHover hover:to-indigo-500 text-white font-bold text-sm shadow-glow-purple transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2">
                  <span>Proceed to Secure Checkout</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="border-t border-brand-surfaceBorder w-full"></div>
                  <span className="bg-brand-surface px-3 text-[10px] font-medium tracking-wider uppercase text-brand-muted absolute">Express One-Tap</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button type="button" className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.72-7.87-12.09-14.37-6.3-9.35-11.24-20.2-14.82-32.55-3.58-12.35-5.37-23.75-5.37-34.2 0-14.53 3.65-26.68 10.95-36.45 7.3-9.77 16.51-14.77 27.63-15 5.1 0 10.74 1.34 16.92 4.02 6.18 2.68 10.15 4.09 11.91 4.23 1.5.14 5.63-1.33 12.39-4.41 6.76-3.08 12.63-4.39 17.62-3.93 13.57.94 24.31 5.86 32.22 14.77-11.83 7.15-17.61 16.89-17.34 29.21.26 9.8 4.18 17.96 11.76 24.48 7.58 6.52 16.48 10.23 26.71 11.13-2.12 6.44-4.87 13.11-8.25 20.02zM119.22 31.85c0-7.3 2.66-14.28 7.98-20.94 5.32-6.66 11.82-10.63 19.5-11.91.43 1.11.64 2.27.64 3.48 0 7.33-2.73 14.29-8.19 20.88-5.46 6.59-11.95 10.39-19.47 11.4-.14-.98-.46-1.95-.46-2.91z" />
                    </svg>
                    <span>Pay</span>
                  </button>
                  <button type="button" className="py-2.5 px-4 rounded-xl bg-[#1f2433] hover:bg-[#252b3d] text-white border border-brand-surfaceBorder font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                    <span className="text-slate-300 font-medium">G</span>
                    <span>Pay</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button onClick={() => setShowPromo(!showPromo)} type="button" className="w-full flex items-center justify-between text-xs text-brand-muted hover:text-white py-1 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      Have a Studio Gift Card or Patron Key?
                    </span>
                    <svg className={`w-3.5 h-3.5 transition-transform ${showPromo ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  {showPromo && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <input className="flex-grow bg-brand-bg border border-brand-surfaceBorder text-xs text-white uppercase tracking-wider rounded-xl px-3 py-2 focus:outline-none focus:border-brand-accent" placeholder="Enter cipher code..." type="text" />
                      <button type="button" className="px-3.5 py-2 bg-brand-surface border border-brand-surfaceBorder hover:border-brand-accent text-xs font-semibold rounded-xl text-white transition-colors">Apply</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-surfaceBorder/80 flex items-center justify-center gap-2 text-[11px] text-brand-muted">
                <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fillRule="evenodd" />
                </svg>
                <span>256-Bit Encrypted Atelier Direct Transaction</span>
              </div>
            </div>

            <div className="bg-brand-surfaceAlt/60 border border-brand-surfaceBorder rounded-2xl p-4 text-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">Direct Atelier Compensation</div>
                  <div className="text-brand-muted text-[11px] mt-0.5">82% of every sale goes directly to the master artisan studio.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">30-Day Quiet Returns</div>
                  <div className="text-brand-muted text-[11px] mt-0.5">Experience the pieces in your home with prepaid return packaging.</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16 pt-12 border-t border-brand-surfaceBorder/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Atelier Harmonization</span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1">Frequently Paired with Your Bag</h3>
            </div>
            <Link to="/" className="text-xs font-semibold text-brand-accent hover:text-brand-accentLight flex items-center gap-1 mt-2 sm:mt-0 transition-colors">
              <span>View complete catalog pairings</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((rec) => (
              <div key={rec.name} className="bg-brand-surface border border-brand-surfaceBorder hover:border-brand-accent/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-full h-36 rounded-xl bg-[#1b202e] mb-3 flex items-center justify-center relative overflow-hidden">
                    <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d={rec.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                    </svg>
                    <span className="absolute bottom-2 left-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-indigo-300 font-mono">{rec.tag}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{rec.name}</h4>
                  <p className="text-xs text-brand-muted mt-0.5">{rec.sub}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-brand-surfaceBorder/60 flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-mono">${rec.price.toFixed(2)}</span>
                  <button type="button" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-surfaceBorder hover:bg-brand-accent text-white transition-colors">+ Add to Bag</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-brand-surfaceBorder bg-[#080a10]">
        <div className="border-b border-brand-surfaceBorder/60 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            {[
              { title: "Mindful Shipping", sub: "100% Carbon-neutral courier delivery with recycled packaging." },
              { title: "Artisan Provenance", sub: "Numbered edition certificate and signed master maker ledger." },
              { title: "30-Day Quiet Return", sub: "Complimentary return parcel label included in every cedar box." },
              { title: "Patron Encrypted", sub: "Direct secure settlement via tokenized high-assurance keys." },
            ].map((t, i) => (
              <div key={t.title} className="space-y-1">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-indigo-400" : i === 1 ? "bg-brand-gold" : i === 2 ? "bg-emerald-400" : "bg-purple-400"}`}></span>
                  {t.title}
                </div>
                <p className="text-[11px] text-brand-muted">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-accent to-indigo-400 p-[1px]">
                  <div className="w-full h-full bg-brand-bg rounded-[7px] flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 7.03 3 12a9 9 0 0 0 9 9z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">Moksha Studio</span>
              </div>
              <p className="text-xs text-brand-muted max-w-sm">
                Bridging master Japanese ateliers and mindful international collectors. Crafted with patience, numbered in reverence.
              </p>
              <div className="text-xs text-brand-muted">
                Atelier inquiries: <a className="text-slate-300 hover:text-white underline" href="mailto:concierge@moksha.studio">concierge@moksha.studio</a>
              </div>
            </div>
            {[
              { title: "Catalog", links: ["Wearable Objects", "Obsidian Stoneware", "Nagano Woods", "Limited Batches"] },
              { title: "Studio", links: ["Philosophy & Roots", "Artisan Collective", "Sustainability Ledger", "Press Inquiries"] },
              { title: "Patron Care", links: ["Order Tracking", "Private Concierge", "Care Instructions", "Terms of Atelier"] },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">{col.title}</h5>
                <ul className="space-y-2 text-xs text-brand-muted">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-brand-surfaceBorder/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
            <p>© 2025 Moksha Studio Inc. All rights reserved across all editions.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Charter</a>
              <a href="#" className="hover:text-white transition-colors">Atelier Provenance Code</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
