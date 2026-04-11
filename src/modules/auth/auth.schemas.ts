import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export const refreshSchema = z.object({
  refreshToken: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
