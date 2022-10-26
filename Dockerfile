FROM node:18-alpine3.15

# copy necessary files
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

# build for production
RUN npm run build --production

###
RUN npm install -g serve
EXPOSE 80
CMD ["serve","-p", "80","dist"]