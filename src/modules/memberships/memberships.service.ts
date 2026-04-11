import { EventMembershipStatus, EventRole } from '@prisma/client'
import { ConflictError } from '../../shared/errors/conflict.error'
import { NotFoundError } from '../../shared/errors/not-found.error'
import { AppError } from '../../shared/errors/app-error'
import { auditLog } from '../../shared/audit/audit.service'
import { canTransition } from './membership-status.machine'
import {
  createMembership,
  findMembershipById,
  findMembershipByPersonEvent,
  findMembershipHistory,
  findMemberships,
  updateMembershipStatus,
} from './memberships.repository'

export async function create(personId: string, eventId: string, role: EventRole) {
  const duplicate = await findMembershipByPersonEvent(personId, eventId)
  if (duplicate) throw new ConflictError('Pessoa já inscrita neste evento.')
  return createMembership(personId, eventId, role)
}

export async function list(filters: {
  eventId?: string
  personId?: string
  status?: string
}) {
  return findMemberships({
    eventId: filters.eventId,
    personId: filters.personId,
    status: filters.status as EventMembershipStatus | undefined,
  })
}

export async function getById(id: string) {
  const membership = await findMembershipById(id)
  if (!membership) throw new NotFoundError('Inscrição não encontrada.')
  return membership
}

export async function transition(
  id: string,
  status: EventMembershipStatus,
  actorAccountId: string,
  reason?: string,
) {
  const membership = await findMembershipById(id)
  if (!membership) throw new NotFoundError('Inscrição não encontrada.')

  if (!canTransition(membership.status, status)) {
    throw new AppError(
      `Transição inválida: ${membership.status} → ${status}`,
      422,
    )
  }

  return updateMembershipStatus(id, status, actorAccountId, reason)
}

export async function approve(id: string, actorAccountId: string) {
  const updated = await transition(id, 'APROVADO', actorAccountId)
  auditLog({
    actorId: actorAccountId,
    action: 'MEMBERSHIP_APPROVED',
    entity: 'EventMembership',
    entityId: id,
  })
  return updated
}

export async function refuse(id: string, actorAccountId: string, reason: string) {
  const updated = await transition(id, 'RECUSADO', actorAccountId, reason)
  auditLog({
    actorId: actorAccountId,
    action: 'MEMBERSHIP_REFUSED',
    entity: 'EventMembership',
    entityId: id,
    payload: { reason },
  })
  return updated
}

export async function getHistory(id: string) {
  const membership = await findMembershipById(id)
  if (!membership) throw new NotFoundError('Inscrição não encontrada.')
  return findMembershipHistory(id)
}
