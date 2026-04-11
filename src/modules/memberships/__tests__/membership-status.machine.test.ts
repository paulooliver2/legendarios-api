import { describe, it, expect, vi } from 'vitest'

// Prisma pode não estar gerado em CI/testes unitários — mock do enum
vi.mock('@prisma/client', () => ({
  EventMembershipStatus: {
    PRE_INSCRITO: 'PRE_INSCRITO',
    INSCRITO: 'INSCRITO',
    EM_ANALISE: 'EM_ANALISE',
    APROVADO: 'APROVADO',
    RECUSADO: 'RECUSADO',
    CANCELADO: 'CANCELADO',
  },
}))

import { canTransition } from '../membership-status.machine'

describe('membership-status.machine', () => {
  describe('transições válidas', () => {
    it('PRE_INSCRITO → INSCRITO é permitido', () => {
      expect(canTransition('PRE_INSCRITO', 'INSCRITO')).toBe(true)
    })

    it('PRE_INSCRITO → CANCELADO é permitido', () => {
      expect(canTransition('PRE_INSCRITO', 'CANCELADO')).toBe(true)
    })

    it('INSCRITO → EM_ANALISE é permitido', () => {
      expect(canTransition('INSCRITO', 'EM_ANALISE')).toBe(true)
    })

    it('INSCRITO → CANCELADO é permitido', () => {
      expect(canTransition('INSCRITO', 'CANCELADO')).toBe(true)
    })

    it('EM_ANALISE → APROVADO é permitido', () => {
      expect(canTransition('EM_ANALISE', 'APROVADO')).toBe(true)
    })

    it('EM_ANALISE → RECUSADO é permitido', () => {
      expect(canTransition('EM_ANALISE', 'RECUSADO')).toBe(true)
    })

    it('APROVADO → CANCELADO é permitido', () => {
      expect(canTransition('APROVADO', 'CANCELADO')).toBe(true)
    })
  })

  describe('transições inválidas', () => {
    it('PRE_INSCRITO → APROVADO não é permitido (pula etapas)', () => {
      expect(canTransition('PRE_INSCRITO', 'APROVADO')).toBe(false)
    })

    it('APROVADO → INSCRITO não é permitido (retrocesso)', () => {
      expect(canTransition('APROVADO', 'INSCRITO')).toBe(false)
    })

    it('RECUSADO → qualquer status não é permitido (estado final)', () => {
      expect(canTransition('RECUSADO', 'INSCRITO')).toBe(false)
      expect(canTransition('RECUSADO', 'PRE_INSCRITO')).toBe(false)
      expect(canTransition('RECUSADO', 'APROVADO')).toBe(false)
    })

    it('CANCELADO → qualquer status não é permitido (estado final)', () => {
      expect(canTransition('CANCELADO', 'INSCRITO')).toBe(false)
      expect(canTransition('CANCELADO', 'PRE_INSCRITO')).toBe(false)
    })

    it('EM_ANALISE → PRE_INSCRITO não é permitido (retrocesso)', () => {
      expect(canTransition('EM_ANALISE', 'PRE_INSCRITO')).toBe(false)
    })
  })
})
