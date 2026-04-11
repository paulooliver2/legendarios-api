import { JourneyStatus } from '@prisma/client'
import { ConflictError } from '../../shared/errors/conflict.error'
import { NotFoundError } from '../../shared/errors/not-found.error'
import { auditLog } from '../../shared/audit/audit.service'
import { parsePagination, paginatedResponse } from '../../shared/utils/pagination.util'
import {
  createPerson,
  findPersonByEmail,
  findPersonById,
  findPersons,
  updatePerson,
  updatePersonJourney,
} from './persons.repository'
import { CreatePersonInput, UpdatePersonInput, UpdateJourneyInput } from './persons.schemas'

export async function create(input: CreatePersonInput, actorId?: string) {
  if (input.email) {
    const existing = await findPersonByEmail(input.email)
    if (existing) throw new ConflictError('E-mail já cadastrado.')
  }
  const person = await createPerson(input)

  auditLog({
    actorId,
    action: 'PERSON_CREATED',
    entity: 'Person',
    entityId: person.id,
    payload: { fullName: person.fullName, email: person.email ?? undefined },
  })

  return person
}

export async function list(query: { page?: number; limit?: number }) {
  const { page, limit, skip, take } = parsePagination(query)
  const { data, total } = await findPersons(skip, take)
  return paginatedResponse(data, total, page, limit)
}

export async function getById(id: string) {
  const person = await findPersonById(id)
  if (!person) throw new NotFoundError('Pessoa não encontrada.')
  return person
}

export async function update(id: string, input: UpdatePersonInput) {
  const person = await findPersonById(id)
  if (!person) throw new NotFoundError('Pessoa não encontrada.')

  if (input.email && input.email !== person.email) {
    const existing = await findPersonByEmail(input.email)
    if (existing) throw new ConflictError('E-mail já cadastrado.')
  }

  return updatePerson(id, input)
}

export async function promoteJourney(
  id: string,
  input: UpdateJourneyInput,
  actorId: string,
) {
  const person = await findPersonById(id)
  if (!person) throw new NotFoundError('Pessoa não encontrada.')

  const updated = await updatePersonJourney(id, input.journeyStatus as JourneyStatus)

  auditLog({
    actorId,
    action: 'JOURNEY_PROMOTED',
    entity: 'Person',
    entityId: id,
    payload: {
      from: person.journeyStatus,
      to: input.journeyStatus,
      reason: input.reason,
    },
  })

  return updated
}
