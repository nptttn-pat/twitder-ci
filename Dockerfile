FROM node:lts-slim
COPY package*.json ./
RUN npm install --only=prod
COPY . .
CMD ["node", "index.js"]