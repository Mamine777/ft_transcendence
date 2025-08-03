FROM node:22.16.0

WORKDIR /app

COPY ../node_modules ./node_modules

COPY . .

CMD ["npx", "ts-node", "server.ts"]