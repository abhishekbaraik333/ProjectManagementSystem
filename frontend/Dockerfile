# Stage 1: Build the React Application
FROM node:24-alpine AS builder

WORKDIR /app

# Accept build-time API base URL argument
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
