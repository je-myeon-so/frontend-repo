FROM node:22.14.0 as build-stage
WORKDIR /app
COPY package*.json ./

# Yarn is already installed
RUN yarn install
COPY . .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
