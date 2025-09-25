FROM node:22.2.0

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY . .

RUN npm install

EXPOSE 5173

COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]

