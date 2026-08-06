FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# "/de/" instead of "/": the root path 301-redirects to an absolute
# "https://" URL (correct for external clients behind Traefik's TLS
# termination), which this container can't itself follow since it only
# ever speaks plain HTTP internally.
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1/de/ || exit 1
