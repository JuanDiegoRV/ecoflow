import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'

const linkClass = ({ isActive }: { isActive: boolean }) => `rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'}`

export function AppShell() {
  const { user, signOut } = useAuth()
  const profile = useCurrentProfile()
  const isAdmin = profile.data?.rol === 'admin'
  return <div className="min-h-screen bg-[#f5f8f3] text-[#14251b] lg:flex"><aside className="border-b border-slate-200 bg-white px-5 py-5 lg:flex lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:px-6 lg:py-8"><div className="flex items-center justify-between lg:block"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">EcoFlow</p><p className="mt-2 text-sm text-slate-500">Operaciones solares</p></div><button className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => void signOut()} type="button">Salir</button></div><nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Navegación principal"><NavLink className={linkClass} to="/">Resumen</NavLink><NavLink className={linkClass} to="/projects">Proyectos</NavLink><NavLink className={linkClass} to="/materials">Materiales</NavLink>{isAdmin && <NavLink className={linkClass} to="/projects/new">Nuevo proyecto</NavLink>}<NavLink className={linkClass} to="/diagnostic">Diagnóstico RLS</NavLink></nav><div className="mt-auto hidden border-t border-slate-100 pt-6 lg:block"><p className="truncate text-sm font-semibold">{profile.data?.nombre_completo ?? user?.email}</p><p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{profile.data?.rol === 'admin' ? 'Administrador' : 'Instalador'}</p><button className="mt-5 text-sm font-medium text-slate-500 hover:text-slate-900" onClick={() => void signOut()} type="button">Cerrar sesión</button></div></aside><main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10"><Outlet /></main></div>
}
