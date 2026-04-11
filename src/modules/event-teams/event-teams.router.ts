import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import {
  createEventTeamHandler,
  listEventTeamsHandler,
  getEventTeamHandler,
  deleteEventTeamHandler,
} from './event-teams.controller'
import { listTeamMembersHandler } from '../team-memberships/team-memberships.router'

export const eventTeamsRouter = Router({ mergeParams: true })

eventTeamsRouter.post('/:eventId/teams', authenticate, requireRole(['ADMIN', 'OPERATOR']), createEventTeamHandler)
eventTeamsRouter.get('/:eventId/teams', authenticate, listEventTeamsHandler)
eventTeamsRouter.get('/:eventId/teams/:teamId', authenticate, getEventTeamHandler)
eventTeamsRouter.delete('/:eventId/teams/:teamId', authenticate, requireRole(['ADMIN']), deleteEventTeamHandler)
eventTeamsRouter.get('/:eventId/teams/:teamId/members', authenticate, listTeamMembersHandler)
