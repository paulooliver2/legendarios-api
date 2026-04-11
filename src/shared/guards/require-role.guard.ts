import { NextFunction, Request, Response } from 'express'
import { SystemRole } from '@prisma/client'
import { ForbiddenError } from '../errors/forbidden.error'
import { UnauthorizedError } from '../errors/unauthorized.error'

/**
 * Guard de SystemRole — verifica o papel da conta no sistema.
 * Uso: requireRole(['ADMIN', 'OPERATOR'])
 */
export function requireRole(roles: SystemRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new UnauthorizedError()
    }

    if (!roles.includes(req.auth.systemRole as SystemRole)) {
      throw new ForbiddenError(
        `Acesso restrito. Requerido: ${roles.join(', ')}.`,
      )
    }

    next()
  }
}
