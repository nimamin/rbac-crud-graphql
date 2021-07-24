FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json ./

RUN npm install --only=production

COPY . .

CMD ["npm", "start"]