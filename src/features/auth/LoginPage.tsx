import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { user, signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  if (user) return <Navigate to="/" replace />
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(''); try { await signIn(email, password); setPassword(''); navigate((location.state as { from?: string } | null)?.from ?? '/') } catch (reason) { setError(reason instanceof Error ? reason.message : 'No fue posible iniciar sesión.') } finally { setLoading(false) } }
  return <main className="min-h-screen bg-[#f5f8f3] px-6 py-12"><div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-center"><section><p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">EcoFlow</p><h1 className="mt-5 text-5xl font-semibold tracking-tight text-[#183b2a]">La energía solar, mejor organizada.</h1><p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">Gestiona proyectos de instalación con información clara para cada equipo.</p></section><form className="rounded-3xl bg-white p-8 shadow-xl shadow-emerald-950/10 ring-1 ring-slate-200" onSubmit={submit}><h2 className="text-2xl font-semibold">Iniciar sesión</h2><p className="mt-2 text-sm text-slate-500">Usa una cuenta de Supabase Auth autorizada.</p><label className="mt-8 block text-sm font-medium" htmlFor="login-email">Correo</label><input className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" id="login-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /><label className="mt-5 block text-sm font-medium" htmlFor="login-password">Contraseña</label><input className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />{(!isConfigured || error) && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error || 'Configura Supabase en .env.local.'}</p>}<button className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60" disabled={loading || !isConfigured} type="submit">{loading ? 'Validando…' : 'Entrar'}</button></form></div></main>
}
