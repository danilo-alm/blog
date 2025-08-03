# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate && yarn build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

COPY package.json yarn.lock prisma ./

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public

RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=builder /app/node_modules/prisma/libquery_engine-linux-musl-openssl-3.0.x.so.node ./dist/src/generated/prisma/client

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start:prod"]