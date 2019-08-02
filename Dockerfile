FROM node:8-alpine

ADD server /usr/src/app/server

RUN apk update && apk add bash
RUN cd /usr/src/app/server && npm install

EXPOSE 5000
