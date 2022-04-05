FROM node:16
WORKDIR /usr/src/cycling-events-api
COPY ./package.json .
RUN npm install --only=production