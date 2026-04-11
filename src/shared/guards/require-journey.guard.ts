import { NextFunction, Request, Response } from 'express'
import { JourneyStatus } from '@prisma/client'
import { ForbiddenError } from '../errors/forbidden.error'
import { UnauthorizedError } from '../errors/unauthorized.error'

/**
 * Guard de JourneyStatus — verifica o status da jornada no movimento.
 * Uso: requireJourney('LEGENDARIO')
 */
export function requireJourney(status: JourneyStatus) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new UnauthorizedError()
    }

    if (req.auth.journeyStatus !== status) {
      throw new ForbiddenError(
        `Conteúdo restrito para ${status}.`,
      )
    }

    next()
  }
}
