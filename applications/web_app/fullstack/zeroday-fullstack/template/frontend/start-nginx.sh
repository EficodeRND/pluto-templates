#!/bin/bash

# This script is used in the production Docker image. Not intended for use otherwise.

WEB_DIR=/usr/share/nginx/html

cd "${WEB_DIR}"
mkdir -p config

cat >> config/environment.js << EOF
window.buildEnv = {
  NODE_ENV: "${NODE_ENV}",
  ENDPOINT: "${ENDPOINT}",
  GOOGLE_OAUTH_ID: "${GOOGLE_OAUTH_ID}",
  FACEBOOK_APP_ID: "${FACEBOOK_APP_ID}",
};
EOF

echo "Starting Nginx..."

nginx -c /nginx.conf -g 'daemon off;'
