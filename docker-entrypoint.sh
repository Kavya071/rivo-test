#!/bin/sh
set -e

# Extract hostname from BACKEND_URL (e.g. https://foo.run.app -> foo.run.app)
BACKEND_HOST=$(echo "${BACKEND_URL}" | sed 's|https\?://||' | sed 's|/.*||')

# Replace placeholders with env vars (without touching nginx $variables)
sed -i "s|__PORT__|${PORT:-8080}|g" /etc/nginx/conf.d/default.conf
sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf
sed -i "s|__BACKEND_HOST__|${BACKEND_HOST}|g" /etc/nginx/conf.d/default.conf

echo "Nginx config:"
cat /etc/nginx/conf.d/default.conf
echo "Starting nginx..."

exec nginx -g 'daemon off;'
