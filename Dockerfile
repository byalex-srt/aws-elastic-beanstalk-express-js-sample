FROM node:16-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

USER node

CMD ["npm", "start"]
