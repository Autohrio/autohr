
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app /app
EXPOSE 7654
CMD ["npm", "run", "dev"]
