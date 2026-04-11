import { z } from 'zod'

export const createVerificationSchema = z.object({
  personId: z.string().uuid(),
  type: z.string().min(2),
  notes: z.string().optional(),
})

export type CreateVerificationInput = z.infer<typeof createVerificationSchema>
