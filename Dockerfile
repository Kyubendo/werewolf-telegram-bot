FROM node:16
WORKDIR /app/
COPY package*.json ./
RUN npm install
RUN npm ci
COPY . .