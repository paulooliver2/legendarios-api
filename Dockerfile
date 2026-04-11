FROM node:20-alpine

# OpenSSL necessário para o Prisma schema engine no Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Instala dependências em camada separada (cache eficiente)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copia o entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# O código-fonte é montado via volume no docker-compose (hot reload)
EXPOSE 3333

ENTRYPOINT ["docker-entrypoint.sh"]
