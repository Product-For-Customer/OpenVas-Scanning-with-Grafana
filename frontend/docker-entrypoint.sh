#!/bin/sh
set -eu

: "${VITE_BACKEND_URL:=http://localhost:9000}"
: "${VITE_OPENVAS_URL:=http://localhost:9392}"
: "${CORS_ALLOWED_ORIGINS:=}"

envsubst '${VITE_BACKEND_URL} ${VITE_OPENVAS_URL}' \
  < /usr/share/nginx/html/env-config.template.js \
  > /usr/share/nginx/html/env-config.js

# Build nginx server_name from CORS_ALLOWED_ORIGINS
# Include both IPs (for external access) and service names (for Docker internal calls)
NGINX_SERVER_NAMES=""
if [ -n "$CORS_ALLOWED_ORIGINS" ]; then
  for origin in $(echo "$CORS_ALLOWED_ORIGINS" | tr ',' '\n'); do
    host=$(echo "$origin" | sed 's|https\?://||' | sed 's|:.*||' | tr -d ' ')
    if [ -n "$host" ]; then
      NGINX_SERVER_NAMES="${NGINX_SERVER_NAMES} ${host}"
    fi
  done
fi

NGINX_SERVER_NAMES=$(echo "$NGINX_SERVER_NAMES" | tr -s ' ' | sed 's/^ //')
if [ -z "$NGINX_SERVER_NAMES" ]; then
  NGINX_SERVER_NAMES="_"
fi

export NGINX_SERVER_NAMES

envsubst '${NGINX_SERVER_NAMES}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec "$@"
