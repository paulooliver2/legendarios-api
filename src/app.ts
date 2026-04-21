import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { errorHandler } from './shared/middlewares/error-handler.middleware'
import { requestLogger } from './shared/middlewares/request-logger.middleware'

// Routers
import { authRouter } from './modules/auth/auth.router'
import { personsRouter } from './modules/persons/persons.router'
import { eventsRouter } from './modules/events/events.router'
import { eventTeamsRouter } from './modules/event-teams/event-teams.router'
import { membershipsRouter } from './modules/memberships/memberships.router'
import { teamMembershipsRouter } from './modules/team-memberships/team-memberships.router'
import { pistasRouter } from './modules/manadas/manadas.router'
import { feedbacksRouter } from './modules/feedbacks/feedbacks.router'
import { verificationsRouter } from './modules/verifications/verifications.router'

export const app = express()

// ─── Middlewares globais ──────────────────────────────────────────────────────

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(requestLogger)

// ─── Matriz de permissões ────────────────────────────────────────────────────
//
// Rota                                   Autenticação    Role mínima
// ────────────────────────────────────── ──────────────  ─────────────────────
// POST   /auth/login                     Pública         —
// POST   /auth/refresh                   Pública         —
// POST   /auth/logout                    Pública         —
// POST   /persons                        JWT             OPERATOR
// GET    /persons                        JWT             qualquer
// GET    /persons/:id                    JWT             qualquer
// PATCH  /persons/:id                    JWT             OPERATOR
// PATCH  /persons/:id/journey            JWT             ADMIN
// POST   /persons/:id/account            JWT             ADMIN
// GET    /persons/:id/team-memberships   JWT             qualquer
// GET    /persons/:id/feedbacks          JWT             qualquer
// GET    /persons/:id/verifications      JWT             qualquer
// POST   /events                         JWT             OPERATOR
// GET    /events                         JWT             qualquer
// GET    /events/:id                     JWT             qualquer
// PATCH  /events/:id                     JWT             OPERATOR
// PATCH  /events/:id/publish             JWT             OPERATOR
// DELETE /events/:id                     JWT             ADMIN
// POST   /events/:id/teams               JWT             OPERATOR
// GET    /events/:id/teams               JWT             qualquer
// GET    /events/:id/teams/:id           JWT             qualquer
// DELETE /events/:id/teams/:id           JWT             ADMIN
// GET    /events/:id/teams/:id/members   JWT             qualquer
// POST   /memberships                    JWT             qualquer
// GET    /memberships                    JWT             qualquer
// GET    /memberships/:id                JWT             qualquer
// PATCH  /memberships/:id/status         JWT             qualquer
// PATCH  /memberships/:id/approve        JWT             TEAM_LEADER
// PATCH  /memberships/:id/refuse         JWT             TEAM_LEADER
// GET    /memberships/:id/history        JWT             qualquer
// POST   /team-memberships               JWT             TEAM_LEADER
// POST   /pistas                         JWT             ADMIN
// GET    /pistas                         JWT             qualquer
// GET    /pistas/:id                     JWT             qualquer
// POST   /pistas/:id/members             JWT             ADMIN, OPERATOR, PISTA_LEADER
// GET    /pistas/:id/members             JWT             qualquer
// POST   /feedbacks                      JWT             qualquer
// POST   /verifications                  JWT             OPERATOR
//
// ─── Rotas ───────────────────────────────────────────────────────────────────

app.use('/auth', authRouter)
app.use('/persons', personsRouter)
app.use('/events', eventsRouter)
app.use('/events', eventTeamsRouter)        // /events/:eventId/teams
app.use('/memberships', membershipsRouter)
app.use('/team-memberships', teamMembershipsRouter)
app.use('/pistas', pistasRouter)
app.use('/feedbacks', feedbacksRouter)
app.use('/verifications', verificationsRouter)

// ─── Health check ────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV })
})

// ─── Error handler (deve ser o último middleware) ─────────────────────────────

app.use(errorHandler)
