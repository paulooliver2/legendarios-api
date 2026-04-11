import { Router } from 'express'
import { loginHandler, refreshHandler, logoutHandler } from './auth.controller'

export const authRouter = Router()

authRouter.post('/login', loginHandler)
authRouter.post('/refresh', refreshHandler)
authRouter.post('/logout', logoutHandler)
