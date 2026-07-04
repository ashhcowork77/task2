# Stage 1: Install dependencies
FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm@8

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY payload ./payload
COPY frontend ./frontend

RUN pnpm install

# Stage 2: Build
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm@8

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Stage 3: Production runner
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".next/standalone/server.js"]
