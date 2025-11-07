# Etapa base
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copiar código y .env
COPY . .
COPY .env .  

EXPOSE 3000
CMD ["npm", "start"]
