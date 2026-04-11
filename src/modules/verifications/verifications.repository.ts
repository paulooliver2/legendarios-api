import { prisma } from '../../prisma/client'
import { CreateVerificationInput } from './verifications.schemas'

export async function createVerification(verifiedById: string, data: CreateVerificationInput) {
  return prisma.verification.create({
    data: {
      personId: data.personId,
      type: data.type,
      notes: data.notes,
      verifiedById,
    },
  })
}

export async function findVerificationsForPerson(personId: string) {
  return prisma.verification.findMany({
    where: { personId },
    orderBy: { verifiedAt: 'desc' },
  })
}
