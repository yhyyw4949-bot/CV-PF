# Multi-Stage Production Dockerfile for Yehia Wael Portfolio

# Stage 1: Build Frontend Assets
FROM node:24-alpine AS client-builder
WORKDIR /app/client

# Copy package manifests and install client dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source and build static distribution
COPY client/ ./
RUN npm run build

# Stage 2: Production Server Runtime
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Install production server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server application source code
COPY server/ ./server/

# Copy compiled frontend from client-builder
COPY --from=client-builder /app/client/dist ./client/dist

# Create persistent storage directories for SQLite and uploads
RUN mkdir -p /app/data /app/uploads

# Expose data and uploads as persistent volumes
VOLUME ["/app/data", "/app/uploads"]

EXPOSE 5000

CMD ["node", "server/src/index.js"]
