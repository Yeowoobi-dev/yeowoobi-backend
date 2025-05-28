# FROM node:alpine AS development

# WORKDIR /usr/src/app

# # package.json 복사
# COPY package*.json ./

# # pnpm-lock.yaml
# COPY pnpm-lock.yaml ./

# # pnpm 설치
# RUN npm i -g pnpm

# # Dependancy 설치
# RUN pnpm i 

# # 나머지 파일, 폴더 복사
# COPY . .

# # 커맨드 실행 
# CMD ["pnpm", "start:dev", "book-recommendation"]

FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build book-recommendation

FROM node:20-alpine AS production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

CMD ["node", "dist/apps/book-recommendation/main.js"]
