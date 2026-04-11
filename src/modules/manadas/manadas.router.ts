import { Router } from 'express'
import { authenticate } from '../../shared/middlewares/authenticate.middleware'
import { requireRole } from '../../shared/guards/require-role.guard'
import {
  addManadaMemberHandler,
  createManadaHandler,
  getManadaHandler,
  listManadaMembersHandler,
  listManadasHandler,
} from './manadas.controller'

export const manadasRouter = Router()

manadasRouter.post('/', authenticate, requireRole(['ADMIN', 'OPERATOR']), createManadaHandler)
manadasRouter.get('/', authenticate, listManadasHandler)
manadasRouter.get('/:id', authenticate, getManadaHandler)
manadasRouter.post('/:id/members', authenticate, requireRole(['ADMIN', 'OPERATOR']), addManadaMemberHandler)
manadasRouter.get('/:id/members', authenticate, listManadaMembersHandler)
