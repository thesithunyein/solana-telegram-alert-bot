FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production \
  && rm -rf node_modules/rpc-websockets/node_modules/uuid \
  && npm install uuid@8.3.2 --prefix node_modules/rpc-websockets
COPY . .
CMD ["node", "scripts/telegram-wallet-alert.js"]
