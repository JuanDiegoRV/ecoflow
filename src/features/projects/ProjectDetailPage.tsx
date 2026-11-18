import { Link, useParams } from 'react-router-dom'
import { InstallerAssignmentPanel } from '../../components/projects/InstallerAssignmentPanel'
import { ProjectMaterialsPanel } from '../../components/materials/ProjectMaterialsPanel'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'
import { useProject } from '../../hooks/useProjects'
import { useProjectStatus } from '../../hooks/useProjectStatus'
import { canManageProjects } from '../../lib/permissions'
import { projectStatusLabels } from '../../lib/projectPresentation'

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const query = useProject(projectId)
  const profile = useCurrentProfile()
  const statusMutation = useProjectStatus(projectId ?? '')
  if (query.isLoading) return <LoadingState label="Cargando detalle…" />
  if (query.error) return <ErrorState message={query.error.message} />
  if (!query.data) return <ErrorState message="No se encontró el proyecto." />
  const project = query.data
  const isAdmin = canManageProjects(profile.data?.rol)
  return <div className="max-w-5xl space-y-7"><Link className="text-sm font-semibold text-emerald-700" to="/projects">← Volver a proyectos</Link><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-emerald-700">Detalle de proyecto</p><h1 className="mt-2 text-4xl font-semibold">{project.nombre}</h1><p className="mt-2 text-slate-500">{project.cliente_nombre}</p></div>{isAdmin && <label className="text-sm font-medium">Estado<select className="ml-3 rounded-xl border border-slate-300 bg-white px-3 py-2" value={project.estado} disabled={statusMutation.isPending} onChange={(event) => statusMutation.mutate(event.target.value as typeof project.estado)}>{Object.entries(projectStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}</header>{statusMutation.error && <ErrorState message={statusMutation.error.message} />}{statusMutation.isSuccess && <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800" role="status">Estado actualizado correctamente.</p>}<div className="grid gap-4 sm:grid-cols-2"><Detail label="Estado" value={projectStatusLabels[project.estado]} /><Detail label="Potencia" value={`${project.potencia_kw} kW`} /><Detail label="Fecha planificada" value={project.fecha_planificada ?? 'Sin fecha'} /><Detail label="Dirección" value={project.direccion} /></div>{project.notas && <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><h2 className="font-semibold">Notas</h2><p className="mt-3 whitespace-pre-wrap text-slate-600">{project.notas}</p></section>}<InstallerAssignmentPanel projectId={project.id} canManage={isAdmin} /><ProjectMaterialsPanel projectId={project.id} /></div>
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 font-semibold text-slate-800">{value}</p></div> }
