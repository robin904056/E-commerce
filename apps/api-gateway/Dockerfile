# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/
COPY packages/database/package*.json ./packages/database/
COPY packages/auth/package*.json ./packages/auth/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/api-gateway ./apps/api-gateway
COPY packages ./packages

# Build
WORKDIR /app/apps/api-gateway
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/api-gateway

EXPOSE 8000

CMD ["node", "dist/index.js"]
