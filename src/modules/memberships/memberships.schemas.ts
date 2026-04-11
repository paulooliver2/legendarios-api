import { z } from 'zod'
import { EventMembershipStatus, EventRole } from '@prisma/client'

export const createMembershipSchema = z.object({
  personId: z.string().uuid(),
  eventId: z.string().uuid(),
  role: z.nativeEnum(EventRole).default('PARTICIPANTE'),
})

export const updateMembershipStatusSchema = z.object({
  status: z.nativeEnum(EventMembershipStatus),
  reason: z.string().optional(),
})

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>
export type UpdateMembershipStatusInput = z.infer<typeof updateMembershipStatusSchema>
