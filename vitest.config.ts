import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Não usa globals para evitar mudanças no tsconfig
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/test/setup.ts'],
    // Fornece variáveis de ambiente para testes unitários (evita process.exit do env.ts)
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      PORT: '3333',
      JWT_ACCESS_SECRET: 'test-access-secret-minimo-16-chars',
      JWT_REFRESH_SECRET: 'test-refresh-secret-minimo-16-chars',
      JWT_ACCESS_EXPIRES_IN: '15m',
      JWT_REFRESH_EXPIRES_IN: '7d',
      CORS_ORIGIN: 'http://localhost:5173',
    },
  },
})
