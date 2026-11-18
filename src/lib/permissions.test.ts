import { describe, expect, it } from 'vitest'
import { canManageMaterials, canManageProjects } from './permissions'

describe('role permissions for presentation', () => {
  it('shows management capabilities only to admins', () => {
    expect(canManageProjects('admin')).toBe(true)
    expect(canManageProjects('installer')).toBe(false)
    expect(canManageMaterials(undefined)).toBe(false)
  })
})
