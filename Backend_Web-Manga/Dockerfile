FROM node:18.20.4

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 4001

CMD ["npm","run","start"]