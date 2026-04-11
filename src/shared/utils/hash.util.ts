import { hashSync, compareSync } from 'bcryptjs'
import { createHash } from 'crypto'

export const hash = (value: string): string => hashSync(value, 10)

export const compareHash = (value: string, hashed: string): boolean =>
  compareSync(value, hashed)

export const sha256 = (value: string): string =>
  createHash('sha256').update(value).digest('hex')
