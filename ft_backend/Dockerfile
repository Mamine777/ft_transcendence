FROM node:22.16.0

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY . .

RUN npm install

CMD ["npx", "ts-node", "server.ts"]


