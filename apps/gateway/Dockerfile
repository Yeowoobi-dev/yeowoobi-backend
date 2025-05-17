FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build

FROM node:20-alpine AS production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

CMD ["node", "dist/apps/gateway/main.js"]
