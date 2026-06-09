# ---- Build stage ----
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies (including dev) using the lockfile for reproducible builds
COPY package*.json ./
RUN npm ci

# Build the NestJS app
COPY . .
RUN npm run build

# Drop dev dependencies so only production deps are copied to the runtime image
RUN npm prune --omit=dev

# ---- Runtime stage ----
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production node_modules and compiled output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Run as the non-root user that ships with the node image
USER node

EXPOSE 3000

CMD ["node", "dist/main"]
