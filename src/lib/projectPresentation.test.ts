import { describe, expect, it } from 'vitest'
import { formatProjectStatus, materialUnitLabels } from './projectPresentation'

describe('project presentation', () => {
  it('translates SQL statuses', () => {
    expect(formatProjectStatus('pending')).toBe('Pendiente')
    expect(formatProjectStatus('in_progress')).toBe('En progreso')
    expect(formatProjectStatus('completed')).toBe('Completado')
  })
  it('translates material units', () => {
    expect(materialUnitLabels.meter).toBe('Metro')
  })
})
