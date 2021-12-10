FROM node:14-alpine AS builder

ARG REACT_APP_BACKEND_API_URL
ENV REACT_APP_BACKEND_API_URL $REACT_APP_BACKEND_API_URL
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
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Start nginx
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
