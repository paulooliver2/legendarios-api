import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/app-error'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code ?? 'APP_ERROR',
      message: err.message,
    })
    return
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'VALIDATION_ERROR',
      message: 'Dados inválidos.',
      details: err.flatten().fieldErrors,
    })
    return
  }

  console.error('[Unhandled Error]', err)
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Erro interno do servidor.',
  })
}
