import type { ProjectStatus } from '../../types/database'

export function ProjectFilters({ value, onChange }: { value: ProjectStatus | 'all'; onChange: (value: ProjectStatus | 'all') => void }) {
  return <label className="flex items-center gap-3 text-sm text-slate-600">Estado<select className="rounded-xl border border-slate-300 bg-white px-3 py-2" value={value} onChange={(event) => onChange(event.target.value as ProjectStatus | 'all')}><option value="all">Todos</option><option value="pending">Pendientes</option><option value="in_progress">En progreso</option><option value="completed">Completados</option></select></label>
}
