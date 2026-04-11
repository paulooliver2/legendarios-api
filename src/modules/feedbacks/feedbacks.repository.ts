import { prisma } from '../../prisma/client'
import { CreateFeedbackInput } from './feedbacks.schemas'

export async function createFeedback(giverId: string, data: CreateFeedbackInput) {
  return prisma.feedback.create({
    data: {
      giverId,
      receiverId: data.receiverId,
      eventId: data.eventId,
      content: data.content,
      isAnonymous: data.isAnonymous,
    },
  })
}

export async function findFeedbacksForPerson(receiverId: string, eventId?: string) {
  const feedbacks = await prisma.feedback.findMany({
    where: {
      receiverId,
      ...(eventId ? { eventId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  // Hide giverId for anonymous feedbacks
  return feedbacks.map((f) => ({
    ...f,
    giverId: f.isAnonymous ? null : f.giverId,
  }))
}
