import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { api } from "@/services/api"

const categories = [
  "Ceramics & Homeware",
  "Botanical Fragrance",
  "Loom & Textiles",
  "Mindful Workspace",
  "Tea Ritual & Ironware",
]

const badges = [
  { label: "Member Reserve", className: "bg-brand-600/90 border-brand-400/30" },
  { label: "Artisan Crafted", className: "bg-white/10 border-white/15" },
  { label: "New Arrival", className: "bg-indigo-500/80 border-indigo-400/30" },
  { label: "Organic Certified", className: "bg-white/10 border-white/15" },
  { label: "Low Stock", className: "bg-rose-500/80 border-rose-400/30" },
  { label: "Best Seller", className: "bg-emerald-500/80 border-emerald-400/30" },
]

export function AddProduct() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: categories[0],
    badge: badges[1].label,
    price: "",
    memberPrice: "",
    stock: "",
    batchCode: "",
    artisan: "",
    weight: "",
    dimensions: "",
    origin: "",
  })

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const uploadImage = async () => {
    if (!file) return ""
    const data = new FormData()
    data.append("file", file)
    const res = await api.post("/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data.url as string
  }

  const badgeClass = badges.find((b) => b.label === form.badge)?.className || badges[1].className

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      const image_url = file ? await uploadImage() : ""
      await api.post("/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: image_url || undefined,
      })
      setMessage("Published successfully")
      setTimeout(() => navigate("/"), 1200)
    } catch {
      setMessage("Failed to publish object")
    } finally {
      setLoading(false)
    }
  }

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const priceVal = Number(form.price)
  const previewPrice = isNaN(priceVal) ? "$0.00" : `$${priceVal.toFixed(2)}`

  return (
    <div className="min-h-screen bg-surface-base text-slate-100 font-sans antialiased selection:bg-brand-600 selection:text-white flex flex-col relative overflow-x-hidden">
      <div className="glow-ambient-top pointer-events-none fixed inset-0 z-0 h-[650px] w-full"></div>

      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-brand-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Studio Catalog Intake · Edition Batch 2025.2
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Curate New <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">Artisan Object</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
              Register verified artisan provenance, specify tactile dimensions, release quantities, and high-fidelity sensory photography for the Moksha patron catalog.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 self-start md:self-auto bg-surface-elevated/70 border border-white/10 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Auto-saved to Studio Vault 2m ago</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left form */}
          <div className="lg:col-span-7 space-y-7">

            {/* Basic info */}
            <section className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Object Profile & Provenance</h2>
                    <p className="text-xs text-slate-400">Core taxonomy and editorial naming for the collection.</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">Step 1 of 4</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="name">Object Title <span className="text-brand-400">*</span></label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    className="w-full bg-[#181b25] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-500"
                    placeholder="e.g. Komorebi Obsidian Stoneware Mug"
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="category">Catalog Category <span className="text-brand-400">*</span></label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className="w-full bg-[#181b25] text-xs sm:text-sm text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="badge">Curator Status Tag</label>
                    <select
                      id="badge"
                      value={form.badge}
                      onChange={(e) => setField("badge", e.target.value)}
                      className="w-full bg-[#181b25] text-xs sm:text-sm text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none cursor-pointer"
                    >
                      {badges.map((b) => (
                        <option key={b.label} value={b.label}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="description">Tactile Description & Notes</label>
                    <span className="text-[10px] text-slate-500">Max 280 characters</span>
                  </div>
                  <textarea
                    id="description"
                    rows={3}
                    maxLength={280}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    required
                    className="w-full bg-[#181b25] text-xs sm:text-sm text-slate-100 px-4 py-3 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-500 resize-none"
                    placeholder="Describe the tactile weight, glaze, raw materials, sensory notes, and origin..."
                  />
                </div>
              </div>
            </section>

            {/* Media */}
            <section className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Artisan Visual Assets</h2>
                    <p className="text-xs text-slate-400">High-resolution daylight photography exhibiting authentic textures.</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">Step 2 of 4</span>
              </div>

              <label className="border-2 border-dashed border-white/15 hover:border-brand-400/50 rounded-2xl p-6 transition-all duration-300 bg-surface-elevated/40 text-center flex flex-col items-center justify-center cursor-pointer group">
                <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white">Click or drag studio image file to upload</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">Supports PNG, WEBP, or RAW studio archives up to 25MB. Recommended 1:1 square or 4:3 ratio.</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-400 border border-white/10">Color Space: sRGB</span>
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-400 border border-white/10">Min 2400 × 2400px</span>
                </div>
              </label>

              {preview && (
                <div className="grid grid-cols-4 gap-3">
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-brand-500 group shadow-md">
                    <img src={preview} alt="Primary" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-brand-600 text-[9px] font-bold text-white shadow">PRIMARY</span>
                  </div>
                </div>
              )}
            </section>

            {/* Pricing / inventory */}
            <section className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Valuation & Kiln Release Edition</h2>
                    <p className="text-xs text-slate-400">Establish patron pricing, tier privileges, and numbered batch limits.</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">Step 3 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="price">Patron Price ($) <span className="text-brand-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">$</span>
                    <input
                      id="price"
                      type="number"
                      step="1"
                      value={form.price}
                      onChange={(e) => setField("price", e.target.value)}
                      required
                      className="w-full bg-[#181b25] text-sm text-slate-100 pl-8 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="memberPrice">Member Reserve Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">$</span>
                    <input
                      id="memberPrice"
                      type="number"
                      step="1"
                      value={form.memberPrice}
                      onChange={(e) => setField("memberPrice", e.target.value)}
                      className="w-full bg-[#181b25] text-sm text-slate-100 pl-8 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="stock">Limited Batch Units</label>
                  <input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setField("stock", e.target.value)}
                    required
                    className="w-full bg-[#181b25] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="Total units"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="batchCode">Batch Code Identifier</label>
                  <input
                    id="batchCode"
                    value={form.batchCode}
                    onChange={(e) => setField("batchCode", e.target.value)}
                    className="w-full bg-[#181b25] text-xs font-mono text-slate-200 px-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="artisan">Master Artisan Guild</label>
                  <input
                    id="artisan"
                    value={form.artisan}
                    onChange={(e) => setField("artisan", e.target.value)}
                    className="w-full bg-[#181b25] text-xs text-slate-200 px-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition">Certified Carbon Neutral Freight</span>
                    <p className="text-[11px] text-slate-400">Attach Moksha 100% verified offset certificate to buyer receipts.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-surface-base border-white/20 text-brand-600 focus:ring-brand-500 focus:ring-offset-surface-elevated" />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition">Early Patron Reserve Access (48h Headstart)</span>
                    <p className="text-[11px] text-slate-400">Exclusive priority allocation reserved for Moksha Studio Members.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-surface-base border-white/20 text-brand-600 focus:ring-brand-500 focus:ring-offset-surface-elevated" />
                </label>
              </div>
            </section>

            {/* Dimensions */}
            <section className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Sensory Specifications & Craft Dimensions</h2>
                    <p className="text-xs text-slate-400">Physical metrics for museum packaging and patron care.</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">Step 4 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="weight">Craft Weight</label>
                  <input
                    id="weight"
                    value={form.weight}
                    onChange={(e) => setField("weight", e.target.value)}
                    className="w-full bg-[#181b25] text-xs text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="dimensions">Dimensions</label>
                  <input
                    id="dimensions"
                    value={form.dimensions}
                    onChange={(e) => setField("dimensions", e.target.value)}
                    className="w-full bg-[#181b25] text-xs text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="origin">Country of Craft</label>
                  <input
                    id="origin"
                    value={form.origin}
                    onChange={(e) => setField("origin", e.target.value)}
                    className="w-full bg-[#181b25] text-xs text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>
            </section>

            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-emerald-400" : "text-rose-400"}`}>{message}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-[#7c3aed] text-white text-sm font-bold hover:opacity-95 shadow-lg shadow-brand-600/25 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" />
                    </svg>
                    Publishing…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                    Publish Object
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right live preview */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="glass-card rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
              <div className="glow-ambient-card absolute inset-0 pointer-events-none"></div>

              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Catalog Card Preview</h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">Interactive Patron View</span>
              </div>

              <article className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 border border-white/10 shadow-xl bg-[#151822]">
                <div className="relative h-64 w-full bg-[#1b1f2c] overflow-hidden">
                  <img
                    src={preview || "https://placehold.co/600x400/1b1f2c/c2c1ff?text=Moksha"}
                    alt={form.name || "Untitled Artisan Object"}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold backdrop-blur-md text-white border tracking-wide ${badgeClass}`}>
                      {form.badge || "Artisan Crafted"}
                    </span>
                  </div>
                  <button type="button" aria-label="Add to wishlist" className="absolute top-3 right-3 p-2 rounded-lg bg-surface-base/70 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span>{form.category || categories[0]}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-medium">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>5.0 (New)</span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors">
                      {form.name.trim() || "Untitled Artisan Object"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                      {form.description.trim() || "No description provided yet."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-normal">Patron Price</span>
                      <span className="text-lg font-bold text-white">{previewPrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-brand-600 text-white text-xs font-semibold border border-white/10 hover:border-transparent transition-all shadow-sm">
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Curatorial Quality Standards</h4>
                {[
                  "Authentic Guild Provenance Verified",
                  "High-res sensory daylight imagery approved",
                  "Luminous Indigo Dark Mode typography calibrated",
                ].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-slate-400">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-[#6b58e7] text-white text-xs font-bold hover:opacity-95 shadow-lg shadow-brand-600/25 transition"
              >
                {loading ? "Publishing…" : "Confirm & Publish to Catalog"}
              </button>
            </div>

            <div className="rounded-xl bg-[#131622] border border-white/[0.07] p-4.5 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">Cryptographic Certificate of Origin</h5>
                <p className="text-[11px] text-slate-400">Unique tamper-proof edition metadata upon publication.</p>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-surface-base text-slate-400 text-xs mt-auto pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">M</div>
                <span className="text-base font-bold tracking-tight text-white">Moksha Store</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Studio portal for curating heirloom living materials, botanical remedies, and limited kiln releases with international craft guilds.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] text-slate-400">Connected to Moksha Studio Mainnet Node</span>
              </div>
            </div>
            {[
              { title: "Catalog", links: ["Ceramics", "Botanicals", "Loom Textiles", "Workspace Tools"] },
              { title: "Studio", links: ["Guild Registry", "Master Artisans", "Batch Archive", "Sustainability Charter"] },
              { title: "Patron Care", links: ["Curator Support", "Intake Guidelines", "Terms of Service", "Privacy Policy"] },
            ].map((col) => (
              <div key={col.title} className="space-y-2.5">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200">{col.title}</h5>
                <ul className="space-y-1.5">
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
              <a href="#" className="hover:text-slate-300 transition">Studio Node Status: Online</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
