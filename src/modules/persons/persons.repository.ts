import { prisma } from '../../prisma/client'
import { CreatePersonInput, UpdatePersonInput } from './persons.schemas'

export async function findPersonByEmail(email: string) {
  return prisma.person.findUnique({ where: { email } })
}

export async function createPerson(data: CreatePersonInput) {
  return prisma.person.create({
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  })
}

export async function findPersons(skip: number, take: number) {
  const [data, total] = await prisma.$transaction([
    prisma.person.findMany({
      skip,
      take,
      orderBy: { fullName: 'asc' },
    }),
    prisma.person.count(),
  ])
  return { data, total }
}

export async function findPersonById(id: string) {
  return prisma.person.findUnique({
    where: { id },
    include: {
      manadaMembers: { include: { manada: true } },
    },
  })
}

export async function updatePerson(id: string, data: UpdatePersonInput) {
  return prisma.person.update({
    where: { id },
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  })
}

export async function updatePersonJourney(
  id: string,
  journeyStatus: 'PRE_LEGENDARIO' | 'LEGENDARIO',
) {
  return prisma.person.update({
    where: { id },
    data: { journeyStatus, journeyChangedAt: new Date() },
  })
}
