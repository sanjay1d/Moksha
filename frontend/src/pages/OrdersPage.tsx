import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { api } from "@/services/api"
import type { Order } from "@/types"

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  paid: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  shipped: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  completed: "bg-brand-500/10 text-brand-300 border-brand-500/20",
  cancelled: "bg-rose-500/10 text-rose-300 border-rose-500/20",
}

const statusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      )
    case "shipped":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      )
    case "cancelled":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      )
    default:
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <polyline points="12 6 12 12 16 14" strokeWidth="2" />
        </svg>
      )
  }
}

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      api
        .get(`/payments/verify?session_id=${sessionId}`)
        .then(() => setSearchParams({}, { replace: true }))
    }

    api.get("/orders").then((res) => {
      setOrders(res.data)
      setLoading(false)
    })
  }, [searchParams, setSearchParams])

  return (
    <div className="min-h-screen bg-surface-base text-slate-100 font-sans antialiased selection:bg-brand-600 selection:text-white flex flex-col relative overflow-x-hidden">
      <div className="glow-ambient-top pointer-events-none fixed inset-0 z-0 h-[600px] w-full"></div>

      <main className="relative z-10 flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-brand-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Atelier Ledger
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Order <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">History</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            A complete record of your curated acquisitions, from kiln release to your doorstep.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Retrieving your patron ledger…</p>
        ) : orders.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-slate-300 text-lg font-semibold mb-2">No orders yet.</p>
            <p className="text-slate-400 text-sm">Your atelier acquisitions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const statusClass = statusStyles[order.status.toLowerCase()] || statusStyles.pending
              return (
                <article key={order.id} className="glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-brand-500/30">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Order</span>
                        <span className="text-sm font-mono text-slate-200">#{order.id.slice(-6)}</span>
                      </div>
                      <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusClass}`}>
                      {statusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <li key={item.product_id} className="flex items-center justify-between text-sm py-2 border-b border-white/[0.06] last:border-0">
                        <span className="text-slate-200">
                          {item.name} <span className="text-slate-500">×{item.quantity}</span>
                        </span>
                        <span className="text-slate-300 font-medium font-mono">${item.price_at_purchase.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <div>
                      <span className="text-xs text-slate-400 block">Total Investment</span>
                      <span className="text-lg font-bold text-white font-mono">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status.toLowerCase() === "pending" && (
                        <span className="text-[11px] text-amber-300/80">Awaiting payment confirmation</span>
                      )}
                      {order.status.toLowerCase() === "paid" && (
                        <span className="text-[11px] text-emerald-300/80">Preparing for carbon-neutral courier</span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
