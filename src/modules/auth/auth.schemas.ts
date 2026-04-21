import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export const refreshSchema = z.object({
  refreshToken: z.string(),
})

export const registerSchema = z.object({
  fullName: z.string().min(3),
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  pistaId: z.string().uuid().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
export type RegisterInput = z.infer<typeof registerSchema>
