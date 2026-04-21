import { EventType, EventStatus } from '@prisma/client'
import { NotFoundError } from '../../shared/errors/not-found.error'
import { parsePagination, paginatedResponse } from '../../shared/utils/pagination.util'
import {
  createEvent,
  deleteEvent,
  findEventById,
  findEvents,
  updateEvent,
  updateEventStatus,
} from './events.repository'
import { CreateEventInput, UpdateEventInput } from './events.schemas'

export async function create(input: CreateEventInput) {
  return createEvent(input)
}

export async function list(query: {
  page?: number
  limit?: number
  type?: string
  status?: string
}) {
  const { page, limit, skip, take } = parsePagination(query)
  const filters = {
    type: query.type as EventType | undefined,
    status: query.status as EventStatus | undefined,
  }
  const { data, total } = await findEvents(skip, take, filters)
  return paginatedResponse(data, total, page, limit)
}

export async function getById(id: string) {
  const event = await findEventById(id)
  if (!event) throw new NotFoundError('Evento não encontrado.')
  return event
}

export async function update(id: string, input: UpdateEventInput) {
  const event = await findEventById(id)
  if (!event) throw new NotFoundError('Evento não encontrado.')
  return updateEvent(id, input)
}

export async function changeStatus(id: string, status: EventStatus) {
  const event = await findEventById(id)
  if (!event) throw new NotFoundError('Evento não encontrado.')
  return updateEventStatus(id, status)
}

export async function remove(id: string) {
  const event = await findEventById(id)
  if (!event) throw new NotFoundError('Evento não encontrado.')
  return deleteEvent(id)
}
