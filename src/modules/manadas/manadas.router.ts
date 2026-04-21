import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import {
  addPistaMemberHandler,
  createPistaHandler,
  createPistaTeamHandler,
  getPistaHandler,
  joinPistaHandler,
  listPistaMembersHandler,
  listPistaTeamsHandler,
  listPistasHandler,
  setMemberRoleHandler,
} from './manadas.controller'

export const pistasRouter = Router()

// GET / is public so the register form can list pistas without a token
pistasRouter.get('/', listPistasHandler)
pistasRouter.post('/:id/join', authenticate, joinPistaHandler)
pistasRouter.post('/', authenticate, requireRole(['ADMIN']), createPistaHandler)
pistasRouter.get('/:id', authenticate, getPistaHandler)
pistasRouter.post('/:id/teams', authenticate, requireRole(['ADMIN', 'PISTA_LEADER']), createPistaTeamHandler)
pistasRouter.get('/:id/teams', authenticate, listPistaTeamsHandler)
pistasRouter.post('/:id/members', authenticate, requireRole(['ADMIN', 'OPERATOR', 'PISTA_LEADER']), addPistaMemberHandler)
pistasRouter.patch('/:id/members/:personId/role', authenticate, requireRole(['ADMIN', 'PISTA_LEADER']), setMemberRoleHandler)
pistasRouter.get('/:id/members', authenticate, listPistaMembersHandler)
