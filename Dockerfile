# Etapa 1: Construcción y validación en entorno limpio
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY src ./src

# Etapa 2: Imagen final ligera e inmutable de producción
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
EXPOSE 3000
CMD ["npm", "start"]
