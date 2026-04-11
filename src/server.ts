import { app } from './app'
import { env } from './config/env'
import { prisma } from './prisma/client'

async function bootstrap() {
  try {
    await prisma.$connect()
    console.log('Banco de dados conectado.')

    app.listen(env.PORT, () => {
      console.log(`Servidor rodando em http://localhost:${env.PORT}`)
      console.log(`Ambiente: ${env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

bootstrap()
