import { z } from 'zod'

export const createManadaSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

export type CreateManadaInput = z.infer<typeof createManadaSchema>
