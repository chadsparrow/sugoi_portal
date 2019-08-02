FROM node:8-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk add bash
RUN npm install

COPY . .

EXPOSE 5000
