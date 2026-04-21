import { z } from 'zod'
import { EventType, EventStatus } from '@prisma/client'

export const createEventSchema = z.object({
  name: z.string().min(3),
  type: z.nativeEnum(EventType),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string().optional(),
  uf: z.string().length(2).optional(),
  cidade: z.string().optional(),
  pistaId: z.string().uuid().optional(),
  limiteServos: z.number().int().positive().optional(),
  limiteParticipantes: z.number().int().positive().optional(),
  requirements: z.record(z.array(z.string())).optional(),
})

export const updateEventSchema = createEventSchema.partial()

export const updateEventStatusSchema = z.object({
  status: z.nativeEnum(EventStatus),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type UpdateEventStatusInput = z.infer<typeof updateEventStatusSchema>
