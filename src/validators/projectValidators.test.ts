import { describe, expect, it } from 'vitest'
import { validateMaterialQuantity, validateProjectInput } from './projectValidators'

describe('project validators', () => {
  it('accepts a valid project', () => {
    expect(validateProjectInput({ nombre: 'Solar QA', cliente_nombre: 'Cliente QA', direccion: 'Calle 1 # 2-3', potencia_kw: 8 })).toEqual([])
  })
  it('rejects missing fields and non-positive power', () => {
    expect(validateProjectInput({ nombre: ' ', cliente_nombre: '', direccion: '', potencia_kw: 0 })).toHaveLength(4)
  })
  it('requires a positive material quantity', () => {
    expect(validateMaterialQuantity(0)).toBeTruthy()
    expect(validateMaterialQuantity(2.5)).toBeNull()
  })
})
