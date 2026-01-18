FROM node:20-slim
WORKDIR /app

# Install dependencies (including build tools)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy repository
COPY . .

# Build the server (bundle TypeScript with esbuild)
RUN npx esbuild server/index.ts --bundle --platform=node --target=node20 --format=cjs --outfile=dist/server.cjs --external:cors

ENV PORT=3002
EXPOSE 3002
CMD ["node", "dist/server.cjs"]
