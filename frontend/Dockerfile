# Development Dockerfile for CareNest
# Auto-detects CRA (npm start) vs Vite (npm run dev) via package.json scripts.
# Generated frontends are Vite-based, but this stays compatible with both.

FROM node:18-alpine
WORKDIR /app

# Install dependencies (layer cached when package.json unchanged)
COPY package*.json ./
RUN npm install --legacy-peer-deps
# Fix ajv v6/v8 conflict with CRA/webpack (harmless for Vite)
RUN npm install ajv@8.12.0 --save --legacy-peer-deps 2>/dev/null || true

# Copy source
COPY . .

# Dev server settings — work for both CRA and Vite
ENV PORT=3000
ENV BROWSER=none
ENV CI=false
ENV GENERATE_SOURCEMAP=false
ENV TSC_COMPILE_ON_ERROR=true
ENV NODE_OPTIONS=--openssl-legacy-provider
# Vite needs HOST=0.0.0.0 to bind outside the container
ENV HOST=0.0.0.0

EXPOSE 3000

# Auto-select: if package.json has "dev" script (Vite), use it; else use "start" (CRA).
# Using "sh -c" so the shell evaluates the script selection at runtime.
CMD ["sh", "-c", "if node -e \"const p=require('./package.json');process.exit(p.scripts&&p.scripts.dev?0:1)\"; then npm run dev -- --host 0.0.0.0 --port 3000; else npm start; fi"]
