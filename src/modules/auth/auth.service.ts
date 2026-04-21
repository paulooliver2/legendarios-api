import { prisma } from '../../prisma/client'
import { compareHash, hash } from '../../shared/utils/hash.util'
import { UnauthorizedError } from '../../shared/errors/unauthorized.error'
import { ConflictError } from '../../shared/errors/conflict.error'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './token.service'
import {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from './refresh-token.repository'
import { LoginInput, RegisterInput } from './auth.schemas'

const REFRESH_TOKEN_TTL_DAYS = 7

function refreshTokenExpiresAt(): Date {
  const d = new Date()
  d.setDate(d.getDate() + REFRESH_TOKEN_TTL_DAYS)
  return d
}

async function getPistaIdForLeader(accountId: string): Promise<string | undefined> {
  const member = await prisma.pistaMember.findFirst({
    where: { person: { userAccount: { id: accountId } }, memberRole: 'LIDER' },
    select: { pistaId: true },
  })
  return member?.pistaId ?? undefined
}

export async function login(input: LoginInput) {
  const account = await prisma.userAccount.findUnique({
    where: { username: input.username },
    include: { person: true },
  })

  if (!account || !compareHash(input.password, account.passwordHash)) {
    throw new UnauthorizedError('Usuário ou senha inválidos.')
  }

  if (!account.isActive) {
    throw new UnauthorizedError('Conta desativada.')
  }

  await prisma.userAccount.update({
    where: { id: account.id },
    data: { lastLoginAt: new Date() },
  })

  const pistaId = account.systemRole === 'PISTA_LEADER'
    ? await getPistaIdForLeader(account.id)
    : undefined

  const payload = {
    sub: account.id,
    personId: account.personId,
    systemRole: account.systemRole,
    journeyStatus: account.person.journeyStatus,
    ...(pistaId ? { pistaId } : {}),
  }

  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(account.id)

  await saveRefreshToken(account.id, refreshToken, refreshTokenExpiresAt())

  return {
    accessToken,
    refreshToken,
    user: {
      id: account.personId,
      name: account.person.fullName,
      systemRole: account.systemRole,
      journeyStatus: account.person.journeyStatus,
      pistaId,
    },
  }
}

export async function refresh(token: string) {
  let payload: { sub: string }

  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw new UnauthorizedError('Refresh token inválido ou expirado.')
  }

  const stored = await findRefreshToken(token)

  if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token inválido ou revogado.')
  }

  await revokeRefreshToken(stored.id)

  const account = stored.userAccount

  const pistaId = account.systemRole === 'PISTA_LEADER'
    ? await getPistaIdForLeader(account.id)
    : undefined

  const newPayload = {
    sub: account.id,
    personId: account.personId,
    systemRole: account.systemRole,
    journeyStatus: account.person.journeyStatus,
    ...(pistaId ? { pistaId } : {}),
  }

  const accessToken = generateAccessToken(newPayload)
  const refreshToken = generateRefreshToken(account.id)

  await saveRefreshToken(account.id, refreshToken, refreshTokenExpiresAt())

  return { accessToken, refreshToken }
}

export async function logout(token: string) {
  const stored = await findRefreshToken(token)
  if (stored) {
    await revokeRefreshToken(stored.id)
  }
}

export async function register(input: RegisterInput) {
  const existing = await prisma.userAccount.findUnique({ where: { username: input.username } })
  if (existing) throw new ConflictError('Nome de usuário já está em uso.')

  if (input.email) {
    const emailUsed = await prisma.person.findUnique({ where: { email: input.email } })
    if (emailUsed) throw new ConflictError('E-mail já cadastrado.')
  }

  const person = await prisma.person.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
    },
  })

  const account = await prisma.userAccount.create({
    data: {
      personId: person.id,
      username: input.username,
      passwordHash: hash(input.password),
      systemRole: 'VIEWER',
    },
    include: { person: true },
  })

  if (input.pistaId) {
    await prisma.pistaMember.create({
      data: { personId: person.id, pistaId: input.pistaId, memberRole: 'MEMBRO' },
    })
  }

  const payload = {
    sub: account.id,
    personId: account.personId,
    systemRole: account.systemRole,
    journeyStatus: account.person.journeyStatus,
  }

  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(account.id)

  await saveRefreshToken(account.id, refreshToken, refreshTokenExpiresAt())

  return {
    accessToken,
    refreshToken,
    user: {
      id: account.personId,
      name: account.person.fullName,
      systemRole: account.systemRole,
      journeyStatus: account.person.journeyStatus,
      pistaId: input.pistaId,
    },
  }
}
