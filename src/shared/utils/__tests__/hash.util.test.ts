import { describe, it, expect } from 'vitest'
import { hash, compareHash, sha256 } from '../hash.util'

describe('hash.util', () => {
  describe('hash()', () => {
    it('retorna uma string hasheada diferente do valor original', () => {
      const result = hash('senha123')
      expect(result).not.toBe('senha123')
      expect(result.length).toBeGreaterThan(0)
    })

    it('gera hashes diferentes para a mesma entrada (salt aleatório)', () => {
      const a = hash('mesma-senha')
      const b = hash('mesma-senha')
      expect(a).not.toBe(b)
    })
  })

  describe('compareHash()', () => {
    it('retorna true quando o valor bate com o hash', () => {
      const hashed = hash('senha-correta')
      expect(compareHash('senha-correta', hashed)).toBe(true)
    })

    it('retorna false quando o valor não bate com o hash', () => {
      const hashed = hash('senha-correta')
      expect(compareHash('senha-errada', hashed)).toBe(false)
    })
  })

  describe('sha256()', () => {
    it('retorna sempre o mesmo hash para o mesmo input (determinístico)', () => {
      const a = sha256('token-de-refresh')
      const b = sha256('token-de-refresh')
      expect(a).toBe(b)
    })

    it('retorna hashes diferentes para inputs diferentes', () => {
      const a = sha256('token-a')
      const b = sha256('token-b')
      expect(a).not.toBe(b)
    })

    it('retorna uma string hexadecimal de 64 caracteres (SHA-256)', () => {
      const result = sha256('qualquer-valor')
      expect(result).toMatch(/^[a-f0-9]{64}$/)
    })
  })
})
