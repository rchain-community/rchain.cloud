FROM node:8.12.0-alpine as base
WORKDIR /home/node/app
COPY . ./
RUN yarn install
CMD [ "yarn", "start" ]