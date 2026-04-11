import { EventMembershipStatus, EventRole } from '@prisma/client'
import { prisma } from '../../prisma/client'

export async function createMembership(
  personId: string,
  eventId: string,
  role: EventRole,
) {
  return prisma.eventMembership.create({
    data: { personId, eventId, role, status: 'PRE_INSCRITO' },
    include: { person: true, event: true },
  })
}

export async function findMemberships(filters: {
  eventId?: string
  personId?: string
  status?: EventMembershipStatus
}) {
  return prisma.eventMembership.findMany({
    where: {
      ...(filters.eventId ? { eventId: filters.eventId } : {}),
      ...(filters.personId ? { personId: filters.personId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    include: { person: true, event: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function findMembershipById(id: string) {
  return prisma.eventMembership.findUnique({
    where: { id },
    include: { person: true, event: true },
  })
}

export async function findMembershipByPersonEvent(personId: string, eventId: string) {
  return prisma.eventMembership.findUnique({
    where: { personId_eventId: { personId, eventId } },
  })
}

export async function updateMembershipStatus(
  id: string,
  status: EventMembershipStatus,
  changedByAccountId: string,
  reason?: string,
) {
  const current = await prisma.eventMembership.findUnique({ where: { id } })
  if (!current) return null

  const [updated] = await prisma.$transaction([
    prisma.eventMembership.update({ where: { id }, data: { status } }),
    prisma.eventMembershipStatusHistory.create({
      data: {
        membershipId: id,
        previousStatus: current.status,
        newStatus: status,
        changedByAccountId,
        reason,
      },
    }),
  ])
  return updated
}

export async function findMembershipHistory(membershipId: string) {
  return prisma.eventMembershipStatusHistory.findMany({
    where: { membershipId },
    orderBy: { changedAt: 'desc' },
  })
}
