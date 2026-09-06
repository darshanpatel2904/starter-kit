# Base Node.js image with pnpm installed
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.23.0 --activate

# Stage 1: Build NestJS API & workspace dependencies
FROM base AS builder
WORKDIR /app

# Copy monorepo configuration & lockfiles
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json .npmrc ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install all workspace dependencies
ENV CI=true
RUN pnpm install --frozen-lockfile

# Build workspace packages & NestJS API
RUN pnpm turbo run build --filter=api...

# Isolate production dependencies & build output for api
RUN pnpm --filter=api --prod deploy --legacy /app/pruned

# Stage 2: Production runtime runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Run as non-root node user
USER node

# Copy pruned workspace bundle & built assets
COPY --chown=node:node --from=builder /app/pruned ./

EXPOSE 3001

CMD ["node", "dist/main.js"]
