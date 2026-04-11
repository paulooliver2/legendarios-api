import { ConflictError } from '../../shared/errors/conflict.error'
import { NotFoundError } from '../../shared/errors/not-found.error'
import { findEventById } from '../events/events.repository'
import {
  createEventTeam,
  deleteEventTeam,
  findEventTeamById,
  findEventTeamByName,
  findEventTeams,
} from './event-teams.repository'
import { CreateEventTeamInput } from './event-teams.schemas'

export async function create(eventId: string, input: CreateEventTeamInput) {
  const event = await findEventById(eventId)
  if (!event) throw new NotFoundError('Evento não encontrado.')

  const duplicate = await findEventTeamByName(eventId, input.name)
  if (duplicate) throw new ConflictError('Já existe uma equipe com esse nome neste evento.')

  return createEventTeam(eventId, input)
}

export async function list(eventId: string) {
  const event = await findEventById(eventId)
  if (!event) throw new NotFoundError('Evento não encontrado.')
  return findEventTeams(eventId)
}

export async function getById(eventId: string, teamId: string) {
  const team = await findEventTeamById(teamId)
  if (!team || team.eventId !== eventId) throw new NotFoundError('Equipe não encontrada.')
  return team
}

export async function remove(eventId: string, teamId: string) {
  const team = await findEventTeamById(teamId)
  if (!team || team.eventId !== eventId) throw new NotFoundError('Equipe não encontrada.')
  return deleteEventTeam(teamId)
}
