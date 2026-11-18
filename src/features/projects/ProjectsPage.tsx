import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ProjectCard } from '../../components/projects/ProjectCard'
import { ProjectFilters } from '../../components/projects/ProjectFilters'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import { useProjects } from '../../hooks/useProjects'
import type { ProjectStatus } from '../../types/database'

export function ProjectsPage() {
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all')
  const location = useLocation()
  const created = Boolean((location.state as { created?: boolean } | null)?.created)
  const query = useProjects(status === 'all' ? {} : { status })
  return <div className="space-y-7"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-emerald-700">Gestión operativa</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Proyectos</h1></div><ProjectFilters value={status} onChange={setStatus} /></header>{created && <p className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800" role="status">Proyecto creado correctamente.</p>}{query.isLoading && <LoadingState label="Cargando proyectos…" />}{query.error && <ErrorState message={query.error.message} />}{query.isSuccess && query.data.length === 0 && <EmptyState title="Sin resultados" message="No hay proyectos para el filtro seleccionado." />}{query.isSuccess && query.data.length > 0 && <div className="grid gap-4 xl:grid-cols-2">{query.data.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}</div>
}
