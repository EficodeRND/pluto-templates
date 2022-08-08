FROM node:lts-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Explicitly set exec flag for wait-for (Windows compatability)
RUN chmod u+x ./wait-for.sh

EXPOSE 8000

# Use non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown appuser -R /usr/src/app
USER appuser

# Install app dependencies
RUN npm install

CMD [ "npm", "start" ]
