FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

ENV NODE_ENV production

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "start"]