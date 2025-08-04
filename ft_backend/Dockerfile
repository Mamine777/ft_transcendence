FROM node:22.16.0

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

CMD ["npx", "ts-node", "server.ts"]


