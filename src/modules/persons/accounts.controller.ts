import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { SystemRole } from '@prisma/client'
import { prisma } from '../../prisma/client'
import { hash } from '../../shared/utils/hash.util'
import { NotFoundError } from '../../shared/errors/not-found.error'
import { ConflictError } from '../../shared/errors/conflict.error'
import { auditLog } from '../../shared/audit/audit.service'

const createAccountSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  systemRole: z.nativeEnum(SystemRole).default('VIEWER'),
})

export async function createAccountHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createAccountSchema.parse(req.body)
    const personId = req.params.personId as string

    const person = await prisma.person.findUnique({ where: { id: personId } })
    if (!person) throw new NotFoundError('Pessoa não encontrada.')

    const existing = await prisma.userAccount.findUnique({ where: { personId } })
    if (existing) throw new ConflictError('Esta pessoa já possui uma conta.')

    const byUsername = await prisma.userAccount.findUnique({
      where: { username: input.username },
    })
    if (byUsername) throw new ConflictError('Nome de usuário já está em uso.')

    const account = await prisma.userAccount.create({
      data: {
        personId,
        username: input.username,
        passwordHash: hash(input.password),
        systemRole: input.systemRole,
      },
      select: { id: true, personId: true, username: true, systemRole: true, isActive: true, createdAt: true },
    })

    auditLog({
      actorId: req.auth!.sub,
      action: 'ACCOUNT_CREATED',
      entity: 'UserAccount',
      entityId: account.id,
      payload: { personId, username: input.username, systemRole: input.systemRole },
    })

    res.status(201).json(account)
  } catch (err) {
    next(err)
  }
}
