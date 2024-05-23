FROM node:20

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn

COPY . /app

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
