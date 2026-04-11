#!/bin/sh
set -e

echo "==> [1/3] Gerando Prisma Client..."
npx prisma generate

echo "==> [2/3] Aplicando migrations..."
# Aguarda o banco estar pronto (até 30s)
echo "     Aguardando banco de dados..."
until node -e "
const net = require('net');
const s = new net.Socket();
s.connect(5432, 'db', () => { s.destroy(); process.exit(0); });
s.on('error', () => { s.destroy(); process.exit(1); });
" 2>/dev/null; do
  echo "     Banco não disponível, aguardando..."
  sleep 2
done
echo "     Banco pronto."

# migrate deploy aplica migrations existentes (idempotente)
# Se não existirem migrations ainda, usa db push para sincronizar o schema
if [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "     Nenhuma migration encontrada — usando prisma db push..."
  npx prisma db push --accept-data-loss
else
  npx prisma migrate deploy
fi

echo "==> [3/3] Rodando seed..."
npm run prisma:seed

echo "==> [4/4] Iniciando API..."
exec npm run dev
