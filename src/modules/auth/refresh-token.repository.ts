import { prisma } from '../../prisma/client'
import { sha256 } from '../../shared/utils/hash.util'

export async function saveRefreshToken(userAccountId: string, token: string, expiresAt: Date) {
  return prisma.refreshToken.create({
    data: { userAccountId, tokenHash: sha256(token), expiresAt },
  })
}

export async function findRefreshToken(token: string) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash: sha256(token) },
    include: { userAccount: { include: { person: true } } },
  })
}

export async function revokeRefreshToken(id: string) {
  return prisma.refreshToken.update({
    where: { id },
    data: { isRevoked: true, revokedAt: new Date() },
  })
}

export async function revokeAllUserTokens(userAccountId: string) {
  return prisma.refreshToken.updateMany({
    where: { userAccountId, isRevoked: false },
    data: { isRevoked: true, revokedAt: new Date() },
  })
}
