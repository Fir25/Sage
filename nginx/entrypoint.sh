#!/bin/bash

FRONTEND_PORT=$1
SERVER_NAME=$2
API_URL=$3

# Replace placeholders in the NGINX configuration file
envsubst '${FRONTEND_PORT} ${SERVER_NAME} ${API_URL}' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf

# Start NGINX
nginx -g 'daemon off;'