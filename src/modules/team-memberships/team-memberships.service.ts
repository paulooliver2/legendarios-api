import { TeamRole } from '@prisma/client'
import { AppError } from '../../shared/errors/app-error'
import { ConflictError } from '../../shared/errors/conflict.error'
import { NotFoundError } from '../../shared/errors/not-found.error'
import { findEventTeamById } from '../event-teams/event-teams.repository'
import { findMembershipByPersonEvent } from '../memberships/memberships.repository'
import {
  createTeamMembership,
  findPersonTeamMemberships,
  findTeamMembershipByPersonTeam,
  findTeamMembers,
} from './team-memberships.repository'

export async function assign(personId: string, eventTeamId: string, teamRole: TeamRole) {
  const team = await findEventTeamById(eventTeamId)
  if (!team) throw new NotFoundError('Equipe não encontrada.')

  const membership = await findMembershipByPersonEvent(personId, team.eventId)
  if (!membership || membership.status !== 'APROVADO') {
    throw new AppError('Pessoa não tem inscrição APROVADA neste evento.', 422)
  }

  const duplicate = await findTeamMembershipByPersonTeam(personId, eventTeamId)
  if (duplicate) throw new ConflictError('Pessoa já está nesta equipe.')

  return createTeamMembership(personId, eventTeamId, teamRole)
}

export async function listMembers(eventTeamId: string) {
  const team = await findEventTeamById(eventTeamId)
  if (!team) throw new NotFoundError('Equipe não encontrada.')
  return findTeamMembers(eventTeamId)
}

export async function listPersonTeams(personId: string) {
  return findPersonTeamMemberships(personId)
}
