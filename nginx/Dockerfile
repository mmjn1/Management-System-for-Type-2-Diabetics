FROM nginx:1.19.0-alpine

# Copy the custom nginx.conf to the container
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the default.conf file to the conf.d directory
COPY nginx/default.conf /etc/nginx/conf.d/default.conf