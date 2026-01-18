FROM node:20-slim
WORKDIR /app

# install only production deps (express is required)
COPY package.json package-lock.json* ./
RUN npm install --production --no-audit --no-fund

# copy app
COPY dev-mock-server.js ./

ENV PORT=3002
EXPOSE 3002
CMD ["node", "dev-mock-server.js"]
