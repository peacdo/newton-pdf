# Node.js base image
FROM node:18-alpine

# Puppeteer için gerekli paketler
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Puppeteer'a Chromium'un yerini söyle
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Working directory
WORKDIR /app

# Package files
COPY package*.json ./

# Dependencies
RUN npm ci --only=production

# App files
COPY . .

# User oluştur (security)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Port
EXPOSE 3000

# Start
CMD ["npm", "run", "server"] 