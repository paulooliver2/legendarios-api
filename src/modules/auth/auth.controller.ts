import { Request, Response, NextFunction } from 'express'
import { loginSchema, refreshSchema, registerSchema } from './auth.schemas'
import * as authService from './auth.service'

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body)
    const result = await authService.login(input)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body)
    const result = await authService.refresh(refreshToken)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body)
    await authService.logout(refreshToken)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body)
    const result = await authService.register(input)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}
