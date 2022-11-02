FROM node:lts

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 4000

RUN apt-get -qy update && apt-get -qy install openssl

RUN npm run seed

CMD [ "npm", "run", "dev" ]
