import { Router } from 'express'
import { loginHandler, refreshHandler, logoutHandler, registerHandler } from './auth.controller'

export const authRouter = Router()

authRouter.post('/login', loginHandler)
authRouter.post('/register', registerHandler)
authRouter.post('/refresh', refreshHandler)
authRouter.post('/logout', logoutHandler)
