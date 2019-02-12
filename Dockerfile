FROM node:8.11.4

ADD server /usr/src/app/server

RUN cd /usr/src/app/server && npm install

EXPOSE 5000
