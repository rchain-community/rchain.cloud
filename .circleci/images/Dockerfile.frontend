# First build an image
FROM node:8.12.0-alpine AS builder
WORKDIR /home/node/app
COPY frontend/ .
RUN npm install
RUN npm run build
EXPOSE 8080
CMD [ "npm", "start" ]
