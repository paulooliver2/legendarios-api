import { z } from 'zod'
import { TeamRole } from '@prisma/client'

export const createTeamMembershipSchema = z.object({
  personId: z.string().uuid(),
  eventTeamId: z.string().uuid(),
  teamRole: z.nativeEnum(TeamRole).default('MEMBRO'),
})

export type CreateTeamMembershipInput = z.infer<typeof createTeamMembershipSchema>
