FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3040
ENV NODE_ENV=production
CMD ["npm", "start"]
