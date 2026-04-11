import { prisma } from '../../prisma/client'
import { CreateManadaInput } from './manadas.schemas'

export async function createManada(data: CreateManadaInput) {
  return prisma.manada.create({ data })
}

export async function findManadas() {
  return prisma.manada.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { members: true } } },
  })
}

export async function findManadaById(id: string) {
  return prisma.manada.findUnique({
    where: { id },
    include: { _count: { select: { members: true } } },
  })
}

export async function findManadaMembers(manadaId: string) {
  return prisma.manadaMember.findMany({
    where: { manadaId },
    include: { person: true },
    orderBy: { joinedAt: 'asc' },
  })
}

export async function findManadaMember(personId: string, manadaId: string) {
  return prisma.manadaMember.findUnique({
    where: { personId_manadaId: { personId, manadaId } },
  })
}

export async function addManadaMember(personId: string, manadaId: string) {
  return prisma.manadaMember.create({
    data: { personId, manadaId },
    include: { person: true },
  })
}
