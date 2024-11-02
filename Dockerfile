FROM node:19 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./prisma ./prisma/
COPY . .

RUN npx prisma generate
RUN npx nx run tasker:build:production


FROM node:19-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/apps/tasker/main"]