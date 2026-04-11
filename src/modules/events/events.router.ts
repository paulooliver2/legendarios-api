import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import {
  createEventHandler,
  listEventsHandler,
  getEventHandler,
  updateEventHandler,
  publishEventHandler,
  deleteEventHandler,
} from './events.controller'

export const eventsRouter = Router()

eventsRouter.post('/', authenticate, requireRole(['ADMIN', 'OPERATOR']), createEventHandler)
eventsRouter.get('/', authenticate, listEventsHandler)
eventsRouter.get('/:id', authenticate, getEventHandler)
eventsRouter.patch('/:id', authenticate, requireRole(['ADMIN', 'OPERATOR']), updateEventHandler)
eventsRouter.patch('/:id/publish', authenticate, requireRole(['ADMIN', 'OPERATOR']), publishEventHandler)
eventsRouter.delete('/:id', authenticate, requireRole(['ADMIN']), deleteEventHandler)
