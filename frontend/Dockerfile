# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Declare build argument FIRST (before code copy + build)
ARG NEXT_PUBLIC_API_URL=https://career-setu-backend.onrender.com
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy application code
COPY . .

# Build the application (NEXT_PUBLIC_API_URL is now baked in)
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
