import { prisma } from '../../prisma/client'
import { compareHash } from '../../shared/utils/hash.util'
import { UnauthorizedError } from '../../shared/errors/unauthorized.error'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './token.service'
import {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from './refresh-token.repository'
import { LoginInput } from './auth.schemas'

const REFRESH_TOKEN_TTL_DAYS = 7

function refreshTokenExpiresAt(): Date {
  const d = new Date()
  d.setDate(d.getDate() + REFRESH_TOKEN_TTL_DAYS)
  return d
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

  // Rotação: revoga o token usado e emite um novo par
  await revokeRefreshToken(stored.id)

  const account = stored.userAccount
  const newPayload = {
    sub: account.id,
    personId: account.personId,
    systemRole: account.systemRole,
    journeyStatus: account.person.journeyStatus,
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
