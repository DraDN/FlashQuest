# FROM node:20-alpine
FROM node:20-slim

WORKDIR /app

# install build essentials for better-sqlite3
# RUN apk add --no-cache --update python3 make g++
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]