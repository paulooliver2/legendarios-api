import { z } from 'zod'

export const createEventTeamSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

export type CreateEventTeamInput = z.infer<typeof createEventTeamSchema>
