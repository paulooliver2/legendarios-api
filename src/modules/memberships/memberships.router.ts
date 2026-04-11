import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import {
  approveMembershipHandler,
  createMembershipHandler,
  getMembershipHandler,
  getMembershipHistoryHandler,
  listMembershipsHandler,
  refuseMembershipHandler,
  updateMembershipStatusHandler,
} from './memberships.controller'

export const membershipsRouter = Router()

membershipsRouter.post('/', authenticate, createMembershipHandler)
membershipsRouter.get('/', authenticate, listMembershipsHandler)
membershipsRouter.get('/:id', authenticate, getMembershipHandler)
membershipsRouter.patch('/:id/status', authenticate, updateMembershipStatusHandler)
membershipsRouter.patch(
  '/:id/approve',
  authenticate,
  requireRole(['ADMIN', 'OPERATOR', 'TEAM_LEADER']),
  approveMembershipHandler,
)
membershipsRouter.patch(
  '/:id/refuse',
  authenticate,
  requireRole(['ADMIN', 'OPERATOR', 'TEAM_LEADER']),
  refuseMembershipHandler,
)
membershipsRouter.get('/:id/history', authenticate, getMembershipHistoryHandler)
