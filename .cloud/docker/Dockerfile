# Node
FROM node:11-alpine as build-stage
LABEL maintainer="guillaumebriday@gmail.com"

WORKDIR /app
COPY . /app

RUN yarn install --silent
RUN yarn run production

# Nginx
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
