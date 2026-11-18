import { useCurrentProfile } from '../../hooks/useCurrentProfile'
import { MaterialCatalogPanel } from '../../components/materials/MaterialCatalogPanel'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState'

export function MaterialsPage() { const profile = useCurrentProfile(); if (profile.isLoading) return <LoadingState label="Cargando permisos…" />; if (profile.error) return <ErrorState message={profile.error.message} />; return <div className="space-y-7"><header><p className="text-sm font-semibold text-emerald-700">Inventario operativo</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Catálogo de materiales</h1></header><MaterialCatalogPanel role={profile.data?.rol} /></div> }
