FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE ${BE_SERVER_PORT}

CMD ["npm", "start"]
