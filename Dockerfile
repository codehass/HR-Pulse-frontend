FROM node:22

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
