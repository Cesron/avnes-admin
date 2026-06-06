# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1: build (install + next build)
# ============================================================
FROM node:24-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --include=optional

COPY . .

ENV NODE_ENV=production
RUN npm run build

# Debug: inspeccionar el CSS generado para saber si Tailwind expandió las utilities.
RUN echo "===== CSS files generados =====" \
  && ls -lh .next/static/css/ || true \
  && echo "===== Primeros 80 chars + búsqueda de utilities =====" \
  && for f in .next/static/css/*.css; do \
       echo "--- $f ---"; \
       wc -c "$f"; \
       echo "Contiene .flex? $(grep -c '\\.flex' "$f" || echo 0)"; \
       echo "Contiene @tailwind literal? $(grep -c '@tailwind' "$f" || echo 0)"; \
       echo "Contiene @apply literal? $(grep -c '@apply' "$f" || echo 0)"; \
     done

# ============================================================
# Stage 2: runtime (solo el output standalone de Next)
# ============================================================
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=5 \
  CMD curl --fail --silent --show-error http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]

