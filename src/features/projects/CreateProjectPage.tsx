import { useNavigate } from 'react-router-dom'
import { ProjectForm } from '../../components/projects/ProjectForm'
import { ErrorState } from '../../components/ui/AsyncState'
import { useCreateProject } from '../../hooks/useProjects'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'

export function CreateProjectPage() {
  const navigate = useNavigate()
  const profile = useCurrentProfile()
  const mutation = useCreateProject()
  if (profile.isLoading) return <p className="text-slate-500">Cargando permisos…</p>
  if (profile.data?.rol !== 'admin') return <ErrorState message="Solo un administrador puede crear proyectos." />
  return <div className="space-y-7"><header><p className="text-sm font-semibold text-emerald-700">Administración</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Nuevo proyecto</h1><p className="mt-2 text-slate-500">La organización y el creador se obtienen del perfil autenticado.</p></header><ProjectForm loading={mutation.isPending} error={mutation.error?.message} onSubmit={async (values) => { await mutation.mutateAsync(values); navigate('/projects', { replace: true, state: { created: true } }) }} /></div>
}
