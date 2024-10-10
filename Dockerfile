FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
ARG NODE_ENV
ARG MONGO_PROD_DB
# RUN npm run seed
RUN npm run build
RUN npm prune --omit=dev
EXPOSE 5000
CMD ["node", "dist/index.js"]