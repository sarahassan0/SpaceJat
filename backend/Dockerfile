FROM node:latest

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

COPY services/ ./services
