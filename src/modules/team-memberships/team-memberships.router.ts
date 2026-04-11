import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import {
  assignHandler,
  listTeamMembersHandler,
  listPersonTeamsHandler,
} from './team-memberships.controller'

export const teamMembershipsRouter = Router()

teamMembershipsRouter.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'OPERATOR', 'TEAM_LEADER']),
  assignHandler,
)

export { listTeamMembersHandler, listPersonTeamsHandler }
