# Use Node.js 20 as the base image
FROM node:20-alpine AS base

# Install Linux build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev


# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f93630c97e06af5f5b776c0e34be4b7bb1e#nodealpine
# to understand why libc6-compat might be needed
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install dumb-init for proper signal handling (optional but recommended)
RUN apk add --no-cache dumb-init

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Create database directory
RUN mkdir -p /home/nextjs/app-data
RUN chown -R nextjs:nodejs /home/nextjs

# Copy standalone output from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy node_modules with Prisma dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

# Copy package.json to access scripts
COPY --from=builder /app/package.json ./package.json

# Create a startup script to handle database initialization (as root first)
RUN echo '#!/bin/sh' > start.sh
RUN echo 'set -e' >> start.sh
RUN echo '' >> start.sh
RUN echo 'echo "Initializing database..."' >> start.sh
RUN echo 'npx prisma db push || echo "Database already exists or migration failed"' >> start.sh
RUN echo '' >> start.sh
RUN echo 'echo "Starting application..."' >> start.sh
RUN echo 'node server.js' >> start.sh
RUN chmod +x start.sh

# Create a simple healthcheck script (as root before switching to non-root user)
RUN echo '#!/usr/bin/env node\nconst http = require("http");\nconst options = { host: "localhost", port: 3000, path: "/", timeout: 2000 };\nconst request = http.request(options, (res) => { if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } });\nrequest.on("error", () => process.exit(1));\nrequest.end();' > healthcheck.mjs

# Switch to non-root user
USER nextjs

# Set DATABASE_URL for SQLite
ENV DATABASE_URL=file:/home/nextjs/app-data/database.db

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node healthcheck.mjs

# Start the application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "./start.sh"]