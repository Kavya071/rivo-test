# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV VITE_GOOGLE_CLIENT_ID=331738587654-087blgg1lca6c1ja4sr310ivd7622oe8.apps.googleusercontent.com
ENV VITE_MICROSOFT_CLIENT_ID=810d9324-17ba-4a15-ae8b-b2b9b1f61b83
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENV PORT=8080
ENV BACKEND_URL=http://localhost:8000
EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
