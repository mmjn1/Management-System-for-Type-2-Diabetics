# Build stage for React
FROM node:alpine as build-stage
WORKDIR /app
COPY healthcare_frontend/package*.json ./
RUN npm install
COPY healthcare_frontend/. ./
RUN npm run build

# Production stage for Nginx
FROM nginx:1.19.0-alpine as production-stage

# Copy the React build directory to the location expected by Nginx
COPY --from=build-stage /app/build/ /usr/share/nginx/html/build

# Copy the Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the Django static and media files to their respective locations in the container
COPY healthcare_project/static /usr/share/nginx/static
COPY healthcare_project/media /usr/share/nginx/media

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]