import { useEffect, useRef, useState } from "react"

import { api } from "@/services/api"

interface Message {
  role: "user" | "agent"
  text: string
}

const prompts = [
  "Recommend a ceramic gift under $50",
  "What is the status of my last order?",
  "Tell me about the amber eyewear",
  "Which items are low in stock?",
]

export function Support() {
  const [message, setMessage] = useState("")
  const [history, setHistory] = useState<Message[]>([
    {
      role: "agent",
      text: "Greetings, patron. I am the Moksha Atelier Concierge. Ask me about our curated objects, your order status, or the artisans behind each piece.",
    },
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history, loading])

  const send = async (text = message) => {
    if (!text.trim()) return
    setMessage("")
    setLoading(true)
    setHistory((h) => [...h, { role: "user", text }])
    try {
      const res = await api.post("/ai/chat", { message: text })
      setHistory((h) => [...h, { role: "agent", text: res.data.answer }])
    } catch {
      setHistory((h) => [
        ...h,
        { role: "agent", text: "My apologies — the atelier ledger is temporarily unavailable. Please try again shortly." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-base text-slate-100 font-sans antialiased selection:bg-brand-600 selection:text-white flex flex-col relative overflow-x-hidden">
      <div className="glow-ambient-top pointer-events-none fixed inset-0 z-0 h-[600px] w-full"></div>

      <main className="relative z-10 flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-brand-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Atelier Concierge Online
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">Concierge</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light">
            A quiet, context-aware assistant with access to the Moksha catalog and your order history.
          </p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[70vh] shadow-2xl border border-white/[0.08]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#0b0e17]/40">
            {history.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-brand-600 to-indigo-700 text-white rounded-br-md shadow-lg shadow-brand-600/20"
                      : "glass-panel mr-8 rounded-bl-md text-slate-200"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass-panel mr-8 rounded-2xl rounded-bl-md p-4 text-sm text-slate-300 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="text-xs text-slate-400">Consulting the atelier ledger…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Prompts */}
          <div className="p-4 border-t border-white/[0.08] bg-surface-elevated/50">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  type="button"
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-brand-500/40 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && send()}
                disabled={loading}
                className="flex-1 bg-surface-dim text-sm text-slate-100 px-4 py-3 rounded-xl border border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-500 disabled:opacity-60"
                placeholder="Ask about products or your orders…"
              />
              <button
                onClick={() => send()}
                disabled={loading}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-[#6b58e7] text-white text-sm font-semibold hover:opacity-95 shadow-md shadow-brand-600/20 transition-all disabled:opacity-60"
              >
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
