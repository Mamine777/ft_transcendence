FROM node:22.2.0

WORKDIR /app

COPY package*.json tsconfig.json ./
#RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
