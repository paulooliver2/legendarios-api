import { NextFunction, Request, Response } from 'express'
import { EventRole } from '@prisma/client'
import { ForbiddenError } from '../errors/forbidden.error'
import { UnauthorizedError } from '../errors/unauthorized.error'
import { prisma } from '../../prisma/client'

/**
 * Guard de EventRole — verifica o papel da pessoa em um evento específico.
 * Espera :eventId nos params da rota.
 * Uso: requireEventRole(['LIDER', 'COORDENADOR'])
 */
export function requireEventRole(roles: EventRole[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new UnauthorizedError()
    }

    const eventId = req.params.eventId as string
    if (!eventId) {
      throw new ForbiddenError('Contexto de evento não identificado.')
    }

    const membership = await prisma.eventMembership.findUnique({
      where: {
        personId_eventId: {
          personId: req.auth.personId,
          eventId,
        },
      },
    })

    if (!membership || !roles.includes(membership.role)) {
      throw new ForbiddenError(
        `Papel requerido no evento: ${roles.join(', ')}.`,
      )
    }

    next()
  }
}
