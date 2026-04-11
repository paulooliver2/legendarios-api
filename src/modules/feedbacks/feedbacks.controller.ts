import { Request, Response, NextFunction } from 'express'
import * as feedbacksService from './feedbacks.service'
import { createFeedbackSchema } from './feedbacks.schemas'

export async function createFeedbackHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createFeedbackSchema.parse(req.body)
    const feedback = await feedbacksService.create(req.auth!.personId, input)
    res.status(201).json(feedback)
  } catch (err) {
    next(err)
  }
}

export async function listPersonFeedbacksHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const feedbacks = await feedbacksService.listForPerson(
      req.params.personId as string,
      req.query.eventId as string | undefined,
    )
    res.json(feedbacks)
  } catch (err) {
    next(err)
  }
}
