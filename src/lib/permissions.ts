import type { Role } from '../types/database'

export function canManageProjects(role: Role | undefined): boolean { return role === 'admin' }
export function canManageMaterials(role: Role | undefined): boolean { return role === 'admin' }
