import { z } from 'zod'
import { PistaMemberRole } from '@prisma/client'

export const createPistaSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  uf: z.string().max(2).optional(),
  cidade: z.string().optional(),
})

export const createPistaTeamSchema = z.object({
  name: z.string().min(2),
})

export const addPistaMemberSchema = z.object({
  personId: z.string().uuid(),
  memberRole: z.nativeEnum(PistaMemberRole).optional(),
  pistaTeamId: z.string().uuid().optional(),
})

export const setMemberRoleSchema = z.object({
  memberRole: z.nativeEnum(PistaMemberRole),
  pistaTeamId: z.string().uuid().optional().nullable(),
})

export type CreatePistaInput = z.infer<typeof createPistaSchema>
export type CreatePistaTeamInput = z.infer<typeof createPistaTeamSchema>
export type AddPistaMemberInput = z.infer<typeof addPistaMemberSchema>
export type SetMemberRoleInput = z.infer<typeof setMemberRoleSchema>
