# Backend Dockerfile
FROM node:24-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY src/ ./src/
COPY public/ ./public/

# Ensure directory for file uploads exists
RUN mkdir -p public/images

# Expose backend port
EXPOSE 8000

# Start server
CMD ["node", "src/index.js"]
