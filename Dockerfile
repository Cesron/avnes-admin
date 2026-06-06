# syntax=docker/dockerfile:1.7
# ---------------------------------------------
# Next.js 16 + React 19 standalone Dockerfile
# Optimizado para Coolify / cualquier runtime Docker
# ---------------------------------------------

# ---------- Stage 1: deps ----------
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos sólo los manifests para cachear dependencias
COPY package.json package-lock.json* ./
# Si usás npm
RUN npm ci
# Si usás pnpm, descomentá esto y borrá la línea de npm ci:
# RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# ---------- Stage 2: builder ----------
FROM node:24-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------- Stage 3: runner ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copiamos el output standalone generado por Next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static

# Si tenés carpeta public, copiala (es seguro aunque esté vacía)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Healthcheck opcional: si tenés /api/health
# HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
