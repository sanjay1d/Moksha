import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { GoogleLoginButton } from "@/components/GoogleLoginButton"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/services/api"

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [remember, setRemember] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    try {
      const endpoint = isSignUp ? "/auth/register" : "/auth/login"
      const body = isSignUp ? { email, name, password } : { email, password }
      const res = await api.post(endpoint, body)
      setAuth(res.data.access_token, res.data.user)
      navigate("/")
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Authentication failed")
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans relative overflow-x-hidden flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 mesh-glow-1" />
        <div className="absolute inset-0 mesh-glow-2" />
        <div className="absolute inset-0 mesh-glow-3" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#ffffff05 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left storytelling */}
          <section className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-0 lg:pr-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-tag w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">Curated Release · Edition No. 04</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-headline-xl tracking-tight leading-tight">
                Curated essentials for{" "}
                <span className="bg-gradient-to-r from-primary-fixed-dim via-primary to-secondary bg-clip-text text-transparent">mindful living</span>.
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
                Reconnecting tactile craftsmanship with quiet luxury. Log in to unlock member reserves, seamless tracking, and bespoke artisan selections.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="relative rounded-2xl overflow-hidden glass-panel group p-4 flex flex-col justify-between h-52 border border-white/5 hover:border-primary/30 transition-all duration-300">
                <div className="absolute inset-0 z-0">
                  <img
                    className="w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700 ease-out"
                    src="https://placehold.co/600x400/272a34/c2c1ff?text=Autumnal+Botanical+Set"
                    alt="Autumnal Botanical Set"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/80 backdrop-blur-md text-label-sm text-primary font-semibold border border-white/10">Member Reserve</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">bookmark_added</span>
                </div>
                <div className="relative z-10">
                  <p className="text-title-md text-white font-semibold">Autumnal Botanical Set</p>
                  <p className="text-label-sm text-on-surface-variant">Limited batch release of 450 units</p>
                </div>
              </div>
              <div className="rounded-2xl glass-panel p-5 flex flex-col justify-between h-52 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div className="flex items-center gap-1 text-label-sm text-primary font-semibold">
                    <span className="material-symbols-outlined text-amber-300" style={{ fontSize: 16 }}>star</span>
                    <span>4.96 / 5</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-headline-lg font-bold">28,400+</span>
                  <p className="text-body-sm text-on-surface-variant leading-snug">Mindful patrons enjoying certified sustainable, verified artisan wares worldwide.</p>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-surface bg-surface-variant items-center justify-center text-[10px] text-on-surface">K</div>
                    <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-surface bg-primary-container items-center justify-center text-[10px] text-white">M</div>
                    <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-surface bg-tertiary-container items-center justify-center text-[10px] text-white">R</div>
                  </div>
                  <span className="text-label-sm text-on-surface-variant">Private Tier Access</span>
                </div>
              </div>
            </div>
            <blockquote className="hidden lg:flex items-center gap-3 p-3.5 rounded-xl glass-tag text-body-sm text-on-surface-variant italic">
              <span className="material-symbols-outlined text-primary not-italic shrink-0">format_quote</span>
              <span>"Moksha has completely redefined our morning rituals. The attention to haptic design and quality is uncompromised."</span>
            </blockquote>
          </section>

          {/* Right auth card */}
          <section className="col-span-1 lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px] rounded-3xl glass-panel p-6 sm:p-8 relative shadow-2xl">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest/80 border border-white/10 flex items-center justify-center mb-3 text-primary shadow-inner">
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>lock_open</span>
                </div>
                <h2 className="text-headline-lg-mobile sm:text-headline-lg font-bold tracking-tight">{isSignUp ? "Create account" : "Welcome back"}</h2>
                <p className="text-body-sm text-on-surface-variant mt-1 max-w-xs">
                  {isSignUp ? "Sign up to join the curated collection." : "Sign in to access your curated collection, orders, and member perks."}
                </p>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="h-[48px] rounded-xl glass-tag hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-150 overflow-hidden flex items-center justify-center">
                  <GoogleLoginButton />
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 h-[48px] rounded-xl glass-tag hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-150 group"
                  onClick={() => alert("Apple login coming soon")}
                >
                  <svg className="w-4 h-4 fill-current text-on-surface group-hover:text-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.02-.49 2.64-1.24z"></path>
                  </svg>
                  <span className="text-label-sm text-on-surface group-hover:text-white font-medium">Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-full border-t border-outline-variant/30" />
                <span className="absolute px-3 bg-[#171b28] text-label-sm text-outline uppercase tracking-wider rounded-md border border-white/[0.04]">Or continue with email</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-label-sm text-on-surface-variant font-medium">Full Name</label>
                    <div className="glass-input rounded-xl h-[52px] flex items-center px-3.5 gap-3 focus-within:ring-0">
                      <span className="material-symbols-outlined text-outline shrink-0">person</span>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="w-full bg-transparent border-0 p-0 text-on-surface text-body-md placeholder-outline/60 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-label-sm text-on-surface-variant font-medium">Email Address</label>
                  <div className="glass-input rounded-xl h-[52px] flex items-center px-3.5 gap-3 focus-within:ring-0">
                    <span className="material-symbols-outlined text-outline shrink-0">mail</span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full bg-transparent border-0 p-0 text-on-surface text-body-md placeholder-outline/60 focus:ring-0 focus:outline-none"
                    />
                    {email.includes("@") && (
                      <span className="material-symbols-outlined text-emerald-400 shrink-0" style={{ fontSize: 18 }}>check_circle</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-label-sm text-on-surface-variant font-medium">Password</label>
                    <a href="#" className="text-label-sm text-primary hover:text-primary-fixed hover:underline transition-colors">Forgot password?</a>
                  </div>
                  <div className="glass-input rounded-xl h-[52px] flex items-center px-3.5 gap-3 focus-within:ring-0">
                    <span className="material-symbols-outlined text-outline shrink-0">lock</span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-transparent border-0 p-0 text-on-surface text-body-md placeholder-outline/60 focus:ring-0 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showPassword ? "visibility" : "visibility_off"}</span>
                    </button>
                  </div>
                </div>
                {!isSignUp && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-4 h-4 rounded bg-surface-container-lowest border border-white/20 text-primary-container focus:ring-0 focus:ring-offset-0 transition-colors"
                      />
                      <span className="text-body-sm text-on-surface-variant">Stay signed in for 30 days</span>
                    </label>
                  </div>
                )}
                {message && <p className="text-red-400 text-body-sm">{message}</p>}
                <button type="submit" className="btn-gradient w-full h-[52px] rounded-xl text-title-md text-white font-bold flex items-center justify-center gap-2 mt-2 active:scale-[0.98] transition-transform duration-150">
                  <span>{isSignUp ? "Create account" : "Sign In"}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-outline-variant/20 text-center">
                <p className="text-body-sm text-on-surface-variant">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-label-md text-primary hover:text-primary-fixed font-semibold hover:underline transition-colors ml-1"
                  >
                    {isSignUp ? "Sign in" : "Create an account"}
                  </button>
                </p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[11px] leading-relaxed text-outline/70">
                  By signing in, you agree to our <a className="underline hover:text-on-surface transition-colors" href="#">Terms of Service</a> and <a className="underline hover:text-on-surface transition-colors" href="#">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-outline-variant/20 py-4 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest/60 backdrop-blur-md text-on-surface-variant text-label-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Secure 256-Bit Encrypted Portal · Moksha Store Global</span>
          </div>
          <div className="flex items-center gap-6">
            <a className="hover:text-primary transition-colors" href="#">Store Locator</a>
            <a className="hover:text-primary transition-colors" href="#">Sustainability Guarantee</a>
            <a className="hover:text-primary transition-colors" href="#">Patron Support</a>
            <span className="text-outline">© 2025 Moksha</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
