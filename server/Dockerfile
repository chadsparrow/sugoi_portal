FROM node:10-slim

# Create the server directory
WORKDIR /usr/src/server

# Install server dependencies
# A wildcard si used to ensure both package.json AND package-lock.json are copied
# where available

COPY package*.json /usr/src/server/

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle server source
#COPY . .

CMD ["npm","start"]
