FROM node:14-alpine AS builder

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
# Copy app files
COPY . .
ENV NODE_ENV production
# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production

ARG BACKEND_API_URL
ENV BACKEND_API_URL=${BACKEND_API_URL}

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Start nginx
CMD /bin/sh -c "envsubst '\$PORT,\$BACKEND_API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
