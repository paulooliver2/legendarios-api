import { ConflictError } from '../../shared/errors/conflict.error'
import { NotFoundError } from '../../shared/errors/not-found.error'
import {
  addManadaMember,
  createManada,
  findManadaById,
  findManadaMember,
  findManadaMembers,
  findManadas,
} from './manadas.repository'
import { CreateManadaInput } from './manadas.schemas'

export async function create(input: CreateManadaInput) {
  return createManada(input)
}

export async function list() {
  return findManadas()
}

export async function getById(id: string) {
  const manada = await findManadaById(id)
  if (!manada) throw new NotFoundError('Manada não encontrada.')
  return manada
}

export async function addMember(id: string, personId: string) {
  const manada = await findManadaById(id)
  if (!manada) throw new NotFoundError('Manada não encontrada.')

  const existing = await findManadaMember(personId, id)
  if (existing) throw new ConflictError('Pessoa já é membro desta manada.')

  return addManadaMember(personId, id)
}

export async function listMembers(id: string) {
  const manada = await findManadaById(id)
  if (!manada) throw new NotFoundError('Manada não encontrada.')
  return findManadaMembers(id)
}
