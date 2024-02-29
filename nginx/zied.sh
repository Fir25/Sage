#!/bin/bash

# Replace placeholders in the NGINX setup configuration file
envsubst '${FRONTEND_PORT} ${SERVER_NAME} ${API_URL}' < /etc/nginx/nginx-setup.conf > /etc/nginx/nginx.conf

# Start NGINX
nginx -g 'daemon off;'
