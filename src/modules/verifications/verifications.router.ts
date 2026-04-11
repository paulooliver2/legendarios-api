import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import { createVerificationHandler } from './verifications.controller'

export const verificationsRouter = Router()

verificationsRouter.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'OPERATOR']),
  createVerificationHandler,
)
