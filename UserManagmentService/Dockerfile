FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4010

ENV PATH /app/node_modules/.bin:$PATH

CMD ["npm", "start"]
