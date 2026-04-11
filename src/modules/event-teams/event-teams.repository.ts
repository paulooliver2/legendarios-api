import { prisma } from '../../prisma/client'
import { CreateEventTeamInput } from './event-teams.schemas'

export async function createEventTeam(eventId: string, data: CreateEventTeamInput) {
  return prisma.eventTeam.create({ data: { eventId, ...data } })
}

export async function findEventTeams(eventId: string) {
  return prisma.eventTeam.findMany({ where: { eventId }, orderBy: { name: 'asc' } })
}

export async function findEventTeamById(id: string) {
  return prisma.eventTeam.findUnique({ where: { id } })
}

export async function findEventTeamByName(eventId: string, name: string) {
  return prisma.eventTeam.findUnique({ where: { eventId_name: { eventId, name } } })
}

export async function deleteEventTeam(id: string) {
  return prisma.eventTeam.delete({ where: { id } })
}
