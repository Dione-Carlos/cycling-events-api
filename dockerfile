FROM node:16
WORKDIR /usr/src/cycling-events-api
COPY ./package.json .
RUN npm install --only=production
COPY ./dist ./dist
EXPOSE 5050
CMD ["npm", "start"]