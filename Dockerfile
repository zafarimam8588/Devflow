FROM node:20.12.0-alpine3.19

WORKDIR /zafar

# Install Git
RUN apk add --no-cache git

COPY package*.json tsconfig.json ./


RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","run", "start"]