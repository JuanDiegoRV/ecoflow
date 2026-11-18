import { Link } from 'react-router-dom'
import { ProjectCard } from '../../components/projects/ProjectCard'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'
import { useProjects } from '../../hooks/useProjects'
import type { ProjectStatus } from '../../types/database'

const statuses: Array<{ key: ProjectStatus; label: string; accent: string }> = [{ key: 'pending', label: 'Pendientes', accent: 'text-amber-700' }, { key: 'in_progress', label: 'En progreso', accent: 'text-blue-700' }, { key: 'completed', label: 'Completados', accent: 'text-emerald-700' }]

export function DashboardPage() {
  const profile = useCurrentProfile()
  const projects = useProjects()
  if (profile.isLoading || projects.isLoading) return <LoadingState label="Cargando tu espacio de trabajo…" />
  if (profile.error) return <ErrorState message={profile.error.message} />
  if (projects.error) return <ErrorState message={projects.error.message} />
  const data = projects.data ?? []
  return <div className="space-y-8"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-emerald-700">Resumen operativo</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Proyectos de instalación</h1><p className="mt-2 text-slate-500">Los datos visibles están filtrados por el rol y las políticas RLS.</p></div>{profile.data?.rol === 'admin' && <Link className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800" to="/projects/new">Nuevo proyecto</Link>}</header><div className="grid gap-4 md:grid-cols-3">{statuses.map((status) => <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" key={status.key}><p className={`text-sm font-semibold ${status.accent}`}>{status.label}</p><p className="mt-3 text-4xl font-semibold">{data.filter((project) => project.estado === status.key).length}</p></div>)}</div>{data.length === 0 ? <EmptyState title="No hay proyectos visibles" message="RLS no devolvió proyectos para tu sesión actual." /> : <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Actividad reciente</h2><Link className="text-sm font-semibold text-emerald-700" to="/projects">Ver todos</Link></div><div className="grid gap-4 xl:grid-cols-2">{data.slice(0, 6).map((project) => <ProjectCard key={project.id} project={project} />)}</div></section>}</div>
}
