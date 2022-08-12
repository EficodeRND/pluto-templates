FROM node:lts-alpine

ARG UID=1100
ARG GID=1100

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Explicitly set exec flag for wait-for (Windows compatability)
RUN chmod u+x ./wait-for.sh

EXPOSE 9000 9229

# Use non-root user
RUN addgroup -g $GID -S appgroup && \
    adduser -u $UID -G appgroup -S appuser &&\
    chown appuser -R /usr/src/app
USER appuser

# Install app dependencies
RUN npm install

CMD [ "npm", "start" ]
