import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import {
  createPersonHandler,
  listPersonsHandler,
  getPersonHandler,
  updatePersonHandler,
  promoteJourneyHandler,
} from './persons.controller'
import { createAccountHandler } from './accounts.controller'
import { listPersonTeamsHandler } from '../team-memberships/team-memberships.router'
import { listPersonFeedbacksHandler } from '../feedbacks/feedbacks.controller'
import { listPersonVerificationsHandler } from '../verifications/verifications.controller'

export const personsRouter = Router()

personsRouter.post('/', authenticate, requireRole(['ADMIN', 'OPERATOR']), createPersonHandler)
personsRouter.get('/', authenticate, listPersonsHandler)
personsRouter.get('/:id', authenticate, getPersonHandler)
personsRouter.patch('/:id', authenticate, requireRole(['ADMIN', 'OPERATOR']), updatePersonHandler)
personsRouter.patch('/:id/journey', authenticate, requireRole(['ADMIN']), promoteJourneyHandler)
personsRouter.post('/:personId/account', authenticate, requireRole(['ADMIN']), createAccountHandler)
personsRouter.get('/:personId/team-memberships', authenticate, listPersonTeamsHandler)
personsRouter.get('/:personId/feedbacks', authenticate, listPersonFeedbacksHandler)
personsRouter.get('/:personId/verifications', authenticate, listPersonVerificationsHandler)
