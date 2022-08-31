# Fullstack template

The Fullstack template is a fullstack project using Node and React. The template can be automatically deployed to Amazon EKS using the "AWS EKS" deployment template. 

---
## Contents
- [Fullstack template](#fullstack-template)
  - [Contents](#contents)
  - [Technologies used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Local development with Docker](#local-development-with-docker)
    - [Starting the containers](#starting-the-containers)
    - [Seed the database](#seed-the-database)
  - [Local development without Docker](#local-development-without-docker)
    - [Prepare database](#prepare-database)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Linting & code style](#linting--code-style)
  - [Testing](#testing)
    - [Unit tests](#unit-tests)
    - [Robot tests](#robot-tests)
  - [Setting up Jenkins](#setting-up-jenkins)
  - [Teardown of resources after automatic or manual deployment](#teardown-of-resources-after-automatic-or-manual-deployment)

---

## Technologies used

- **Node backend using PostgreSQL**

  - Bearer Token Authentication using JWT
  - Google Authentication

- **React + Redux Frontend**

  - Webpack 5 + refactored common config
  - React Router 5
  - Building minified nginx image for Docker

- **Docker Compose**

  - Override-files for Unit and Acceptance Testing

- **Robot Framework Testing**

  - Running tests using Selenium Grid + Docker
  - Using Eficode Robot Framework Template

- **Jenkins**

  - Everything built and tested using Docker
  - Trivy security scanning

- **GitHub Actions**
  - Everything built and tested using Docker
  - Trivy security scanning
  - Slack notifications

---

## Prerequisites

- [docker](http://docker.com) and [docker-compose](https://docs.docker.com/compose/)

---

## Local development with Docker

This project comes with a [VSCode Remote Container](https://code.visualstudio.com/docs/remote/containers) setup for local development. It requires a VSCode addon [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) and Docker to work.

To start the remote container open VSCode Command Palette (Ctrl+Shift+P) and type Reopen in container. This will open the folder inside the dev container which will then have fixed (and extensible) list of VSCode extensions, so that everyone working with the project will have an uniform development experience.

The project can also be developed without remote containers but it is recommended to use it.

### Starting the containers

To run the project in development mode, run:

    docker-compose up

For production mode you need to use the production configuration file:

    docker-compose --project-directory . -f compose/production.yml -f compose/db.yml up

### Seed the database

    docker-compose -f docker-compose.yml -f compose/db.yml run backend-dev node db/seeds.js

---

## Local development without Docker

### Prepare database

Install postgresql:

    https://www.postgresql.org/download/

    psql -c "CREATE ROLE demo WITH CREATEDB LOGIN PASSWORD 'demo'"
    psql -c "CREATE DATABASE demo WITH OWNER demo"
    psql -c "CREATE DATABASE demo_test WITH OWNER demo"

Add this line to your .env:

    export DATABASE_URL=postgres://demo:demo@localhost/demo

### Backend

Run these commands in the /backend directory:

    npm install
    npm start

The backend will run on port `9000`

### Frontend

Run these commands in the /frontend directory:

    npm install
    npm start

The frontend will run on port `8000`

---

## Linting & code style

Project code style is based on [Airbnb JavaScript style quide](https://github.com/airbnb/javascript)

To use editorconfig, [download plugin for your IDE](https://editorconfig.org/#download).

Run eslint in Docker container

    docker-compose run backend-dev sh -c "npm run lint"
    docker-compose run frontend-dev sh -c "npm run lint"

Run `npm run lint` in backend and frontend directories to check the linting locally.

---

## Testing

### Unit tests

    docker-compose --project-directory . -f compose/db-test.yml -f compose/test.yml run mocha

### Robot tests

    docker-compose --project-directory . -f compose/db-test.yml -f compose/robot.yml run robot

---

## Setting up Jenkins

### Setting up Jenkins Manually

You can read the instructions on [this page](https://confluence.eficode.fi/x/woB9B).

### Setting up Jenkins automatically

Jenkins can be set up automatically with the executor script named "GitHub Jenkins pipeline setup script". 

---

## Teardown of resources after automatic or manual deployment

The following list includes the resources which are to be removed. Delete resources selectively if required.

1. Delete Jenkins pipeline