import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { createFeedbackHandler } from './feedbacks.controller'

export const feedbacksRouter = Router()

feedbacksRouter.post('/', authenticate, createFeedbackHandler)
