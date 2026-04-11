import { z } from 'zod'
import { EventType } from '@prisma/client'

export const createEventSchema = z.object({
  name: z.string().min(3),
  type: z.nativeEnum(EventType),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string().optional(),
})

export const updateEventSchema = createEventSchema.partial()

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
