# Build-Outside Dockerfile — assumes apps/web/dist already exists on the host.
# Run `nx build web` before invoking `docker build`.
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY apps/web/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
