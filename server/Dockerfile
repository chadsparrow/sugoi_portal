FROM node:8.11.4

# Create the server directory
WORKDIR /usr/src/app

# Install server dependencies
# A wildcard si used to ensure both package.json AND package-lock.json are copied
# where available
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle server source (may only be needed when complete)
COPY . .

EXPOSE 3000
