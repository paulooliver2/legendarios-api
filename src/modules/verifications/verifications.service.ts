import { createVerification, findVerificationsForPerson } from './verifications.repository'
import { CreateVerificationInput } from './verifications.schemas'

export async function create(verifiedById: string, input: CreateVerificationInput) {
  return createVerification(verifiedById, input)
}

export async function listForPerson(personId: string) {
  return findVerificationsForPerson(personId)
}
