#!/bin/sh
set -e

# Replace placeholders with env vars (without touching nginx $variables)
sed -i "s|__PORT__|${PORT:-8080}|g" /etc/nginx/conf.d/default.conf
sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
