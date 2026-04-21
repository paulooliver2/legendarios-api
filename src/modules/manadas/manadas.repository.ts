import { PistaMemberRole } from '@prisma/client'
import { prisma } from '../../prisma/client'
import { CreatePistaInput, CreatePistaTeamInput } from './manadas.schemas'

const memberInclude = {
  person: { select: { id: true, fullName: true, photoUrl: true } },
  pistaTeam: { select: { id: true, name: true } },
} as const

export async function createPista(data: CreatePistaInput) {
  return prisma.pista.create({ data })
}

export async function findPistas() {
  return prisma.pista.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { members: true } },
      members: {
        where: { memberRole: 'LIDER' },
        include: { person: { select: { id: true, fullName: true, photoUrl: true } } },
      },
    },
  })
}

export async function findPistaById(id: string) {
  return prisma.pista.findUnique({
    where: { id },
    include: {
      _count: { select: { members: true } },
      teams: {
        orderBy: { name: 'asc' },
        include: {
          members: {
            include: memberInclude,
            orderBy: { memberRole: 'asc' },
          },
        },
      },
      members: {
        where: { memberRole: 'LIDER' },
        include: { person: { select: { id: true, fullName: true, photoUrl: true } } },
      },
    },
  })
}

export async function findPistaMembers(pistaId: string) {
  return prisma.pistaMember.findMany({
    where: { pistaId },
    include: memberInclude,
    orderBy: [{ memberRole: 'asc' }, { joinedAt: 'asc' }],
  })
}

export async function findPistaMember(personId: string, pistaId: string) {
  return prisma.pistaMember.findUnique({
    where: { personId_pistaId: { personId, pistaId } },
  })
}

export async function addPistaMember(
  personId: string,
  pistaId: string,
  memberRole: PistaMemberRole = 'MEMBRO',
  pistaTeamId?: string,
) {
  return prisma.pistaMember.create({
    data: { personId, pistaId, memberRole, pistaTeamId },
    include: memberInclude,
  })
}

export async function updatePistaMemberRole(
  personId: string,
  pistaId: string,
  memberRole: PistaMemberRole,
  pistaTeamId?: string | null,
) {
  return prisma.pistaMember.update({
    where: { personId_pistaId: { personId, pistaId } },
    data: { memberRole, pistaTeamId },
    include: memberInclude,
  })
}

export async function createPistaTeam(pistaId: string, data: CreatePistaTeamInput) {
  return prisma.pistaTeam.create({ data: { pistaId, ...data } })
}

export async function findPistaTeams(pistaId: string) {
  return prisma.pistaTeam.findMany({
    where: { pistaId },
    orderBy: { name: 'asc' },
    include: {
      members: {
        include: memberInclude,
        orderBy: { memberRole: 'asc' },
      },
    },
  })
}
