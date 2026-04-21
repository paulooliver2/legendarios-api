import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'
import { UnauthorizedError } from '../errors/unauthorized.error'

export interface JwtPayload {
  sub: string        // userAccountId
  personId: string
  systemRole: string
  journeyStatus: string
  pistaId?: string  // preenchido para PISTA_LEADER
}

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token não fornecido.')
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload
    req.auth = payload
    next()
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado.')
  }
}
