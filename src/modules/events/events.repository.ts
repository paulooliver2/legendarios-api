import { EventType } from '@prisma/client'
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
  filters: { type?: EventType; isPublished?: boolean },
) {
  const where = {
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.isPublished !== undefined ? { isPublished: filters.isPublished } : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.event.findMany({ where, skip, take, orderBy: { startDate: 'desc' } }),
    prisma.event.count({ where }),
  ])
  return { data, total }
}

export async function findEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { teams: true },
  })
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

export async function togglePublish(id: string, isPublished: boolean) {
  return prisma.event.update({ where: { id }, data: { isPublished } })
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } })
}
