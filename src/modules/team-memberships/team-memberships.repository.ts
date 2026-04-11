import { TeamRole } from '@prisma/client'
import { prisma } from '../../prisma/client'

export async function createTeamMembership(
  personId: string,
  eventTeamId: string,
  teamRole: TeamRole,
) {
  return prisma.teamMembership.create({
    data: { personId, eventTeamId, teamRole },
    include: { person: true, eventTeam: true },
  })
}

export async function findTeamMembershipByPersonTeam(personId: string, eventTeamId: string) {
  return prisma.teamMembership.findUnique({
    where: { personId_eventTeamId: { personId, eventTeamId } },
  })
}

export async function findTeamMembers(eventTeamId: string) {
  return prisma.teamMembership.findMany({
    where: { eventTeamId },
    include: { person: true },
    orderBy: { assignedAt: 'asc' },
  })
}

export async function findPersonTeamMemberships(personId: string) {
  return prisma.teamMembership.findMany({
    where: { personId },
    include: { eventTeam: { include: { event: true } } },
    orderBy: { assignedAt: 'desc' },
  })
}
