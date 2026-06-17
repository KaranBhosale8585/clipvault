# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Install Python, FFmpeg and dependencies
RUN apk add --no-cache python3 py3-pip ffmpeg

# Create a virtual environment and install yt-dlp
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY services/python/requirements.txt ./services/python/requirements.txt
RUN pip install --no-cache-dir -r services/python/requirements.txt

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure the Python service is available
COPY services/python ./services/python

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
