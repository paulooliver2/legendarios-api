import { EventType, EventStatus } from '@prisma/client'
import { prisma } from '../../prisma/client'
import { CreateEventInput, UpdateEventInput } from './events.schemas'

export async function createEvent(data: CreateEventInput) {
  return prisma.event.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  })
}

export async function findEvents(
  skip: number,
  take: number,
  filters: { type?: EventType; status?: EventStatus },
) {
  const where = {
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.event.findMany({ where, skip, take, orderBy: { startDate: 'desc' } }),
    prisma.event.count({ where }),
  ])
  return { data, total }
}

export async function findEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      teams: true,
      pista: { select: { id: true, name: true } },
      _count: false,
    },
  })
  if (!event) return null

  const [inscritosServos, inscritosParticipantes] = await prisma.$transaction([
    prisma.eventMembership.count({
      where: { eventId: id, role: 'SERVO', status: { in: ['INSCRITO', 'APROVADO'] } },
    }),
    prisma.eventMembership.count({
      where: { eventId: id, role: 'PARTICIPANTE', status: { in: ['INSCRITO', 'APROVADO'] } },
    }),
  ])

  return { ...event, inscritosServos, inscritosParticipantes }
}

export async function updateEvent(id: string, data: UpdateEventInput) {
  return prisma.event.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  })
}

export async function updateEventStatus(id: string, status: EventStatus) {
  return prisma.event.update({ where: { id }, data: { status } })
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } })
}
