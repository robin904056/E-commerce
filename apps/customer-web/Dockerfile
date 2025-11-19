# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/customer-web/package*.json ./apps/customer-web/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/customer-web ./apps/customer-web

# Build
WORKDIR /app/apps/customer-web
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/customer-web/package*.json ./apps/customer-web/

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/apps/customer-web/.next ./apps/customer-web/.next
COPY --from=builder /app/apps/customer-web/public ./apps/customer-web/public
COPY --from=builder /app/apps/customer-web/next.config.js ./apps/customer-web/

WORKDIR /app/apps/customer-web

EXPOSE 3000

CMD ["npm", "start"]
