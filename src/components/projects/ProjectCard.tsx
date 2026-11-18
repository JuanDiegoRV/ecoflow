import { Link } from 'react-router-dom'
import type { Project } from '../../types/database'

const statusLabels = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado' } as const
const statusClasses = { pending: 'bg-amber-100 text-amber-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-emerald-100 text-emerald-800' } as const

export function ProjectCard({ project }: { project: Project }) {
  return <Link className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-emerald-300" to={`/projects/${project.id}`}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-slate-900">{project.nombre}</h3><p className="mt-1 text-sm text-slate-500">{project.cliente_nombre}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[project.estado]}`}>{statusLabels[project.estado]}</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><p className="text-slate-400">Potencia</p><p className="mt-1 font-medium">{project.potencia_kw} kW</p></div><div><p className="text-slate-400">Planificado</p><p className="mt-1 font-medium">{project.fecha_planificada ?? 'Sin fecha'}</p></div></div></Link>
}
