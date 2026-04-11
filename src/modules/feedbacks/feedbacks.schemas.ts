import { z } from 'zod'

export const createFeedbackSchema = z.object({
  receiverId: z.string().uuid(),
  eventId: z.string().uuid().optional(),
  content: z.string().min(10),
  isAnonymous: z.boolean().default(false),
})

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>
