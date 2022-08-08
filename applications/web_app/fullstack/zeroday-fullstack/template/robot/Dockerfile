FROM python:3.9-alpine

ARG UID=1100
ARG GID=1100

RUN mkdir -p /robot
WORKDIR /robot

# CHROME
RUN apk --no-cache upgrade && apk add --no-cache chromium chromium-chromedriver
RUN apk add libexif udev

# FIREFOX
# From https://stackoverflow.com/questions/58738920/running-geckodriver-in-an-alpine-docker-container
# Get all the prereqs
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-2.30-r0.apk
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-bin-2.30-r0.apk
RUN apk add glibc-2.30-r0.apk
RUN apk add glibc-bin-2.30-r0.apk

# And of course we need Firefox if we actually want to *use* GeckoDriver
RUN apk add firefox-esr

# Then install GeckoDriver
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.26.0/geckodriver-v0.26.0-linux64.tar.gz
RUN tar -zxf geckodriver-v0.26.0-linux64.tar.gz -C /usr/bin
RUN geckodriver --version

# ROBOT + LIBRARIES
COPY requirements.txt /tmp/requirements.txt
RUN  pip3 install -r /tmp/requirements.txt

COPY . /robot
# Explicitly set exec flag for wait-for (Windows compatability)
RUN chmod u+x ./wait-for.sh ./run_tests.sh

# Use non-root user
RUN addgroup -g $GID -S appgroup && \
    adduser -u $UID -G appgroup -S appuser &&\
    chown -R appuser /robot
USER appuser
