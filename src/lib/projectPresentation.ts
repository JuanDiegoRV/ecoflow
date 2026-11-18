import type { ProjectStatus } from '../types/database'

export const projectStatusLabels: Record<ProjectStatus, string> = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado' }
export const materialUnitLabels = { unit: 'Unidad', meter: 'Metro', kilogram: 'Kilogramo', liter: 'Litro', box: 'Caja' } as const
export function formatProjectStatus(status: ProjectStatus): string { return projectStatusLabels[status] }
