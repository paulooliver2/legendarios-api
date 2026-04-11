import { createFeedback, findFeedbacksForPerson } from './feedbacks.repository'
import { CreateFeedbackInput } from './feedbacks.schemas'

export async function create(giverId: string, input: CreateFeedbackInput) {
  return createFeedback(giverId, input)
}

export async function listForPerson(receiverId: string, eventId?: string) {
  return findFeedbacksForPerson(receiverId, eventId)
}
