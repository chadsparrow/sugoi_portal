FROM node:latest

ADD server /usr/src/app/server

RUN cd /usr/src/app/server && npm install

EXPOSE 5000
