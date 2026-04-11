import { PrismaClient } from '@prisma/client'

// Singleton do Prisma Client — reutiliza a conexão em toda a aplicação
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
})
