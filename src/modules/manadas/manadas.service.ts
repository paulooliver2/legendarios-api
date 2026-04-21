import { PistaMemberRole } from '@prisma/client'
import { ConflictError } from '../../shared/errors/conflict.error'
import { NotFoundError } from '../../shared/errors/not-found.error'
import {
  addPistaMember,
  createPista,
  createPistaTeam,
  findPistaById,
  findPistaMember,
  findPistaMembers,
  findPistaTeams,
  findPistas,
  updatePistaMemberRole,
} from './manadas.repository'
import { CreatePistaInput, CreatePistaTeamInput, SetMemberRoleInput } from './manadas.schemas'

export async function create(input: CreatePistaInput) {
  return createPista(input)
}

export async function list() {
  return findPistas()
}

export async function getById(id: string) {
  const pista = await findPistaById(id)
  if (!pista) throw new NotFoundError('Pista não encontrada.')
  return pista
}

export async function addMember(
  pistaId: string,
  personId: string,
  memberRole: PistaMemberRole = 'MEMBRO',
  pistaTeamId?: string,
) {
  const pista = await findPistaById(pistaId)
  if (!pista) throw new NotFoundError('Pista não encontrada.')

  const existing = await findPistaMember(personId, pistaId)
  if (existing) throw new ConflictError('Pessoa já é membro desta pista.')

  return addPistaMember(personId, pistaId, memberRole, pistaTeamId)
}

export async function setMemberRole(pistaId: string, personId: string, input: SetMemberRoleInput) {
  const member = await findPistaMember(personId, pistaId)
  if (!member) throw new NotFoundError('Membro não encontrado nesta pista.')
  return updatePistaMemberRole(personId, pistaId, input.memberRole, input.pistaTeamId)
}

export async function listMembers(pistaId: string) {
  const pista = await findPistaById(pistaId)
  if (!pista) throw new NotFoundError('Pista não encontrada.')
  return findPistaMembers(pistaId)
}

export async function addTeam(pistaId: string, input: CreatePistaTeamInput) {
  const pista = await findPistaById(pistaId)
  if (!pista) throw new NotFoundError('Pista não encontrada.')
  return createPistaTeam(pistaId, input)
}

export async function joinPista(pistaId: string, personId: string) {
  const pista = await findPistaById(pistaId)
  if (!pista) throw new NotFoundError('Pista não encontrada.')
  const existing = await findPistaMember(personId, pistaId)
  if (existing) throw new ConflictError('Você já é membro desta pista.')
  return addPistaMember(personId, pistaId, 'MEMBRO')
}

export async function listTeams(pistaId: string) {
  const pista = await findPistaById(pistaId)
  if (!pista) throw new NotFoundError('Pista não encontrada.')
  return findPistaTeams(pistaId)
}
