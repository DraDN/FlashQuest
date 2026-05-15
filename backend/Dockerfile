FROM node:20-alpine

WORKDIR /app

# install build essentials for better-sqlite3
RUN apk add --no-cache --update python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]