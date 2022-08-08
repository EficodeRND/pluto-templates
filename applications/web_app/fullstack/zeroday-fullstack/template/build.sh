#!/bin/bash

test -z "$PROJECT_NAME" && test -f .env.development && \
  PROJECT_NAME=$(grep -e '^PROJECT_NAME=.*' .env.development | cut -d '=' -f2)

dockerPrefix="${PROJECT_NAME}"
mode="dev"
version=$(node -p "require('./package.json').version")
versionOmitted=true
force=false

set -e

### Functions
function show_help() {
cat <<EOF
Usage: build.sh [OPTION]                                         
Build docker images for the project. Images will be named and tagged with 
environment and version and prefixed with ${dockerPrefix}. For example: 
    '${dockerPrefix}/dev/frontend:1.2.3

Options
  -m MODE             Deploy mode, MODE can be 'dev' (default if 
                      omitted) or 'prod'. Affects which docker-compose
                      configuration is used to build the images.
  -v VERSION          Version string to tag build with (defaults to 
                      package.json version if omitted).
  
EOF
}

buildDevImages() {
  set -x
  docker-compose \
  --verbose \
  -f docker-compose.yml \
  --project-directory . \
  -p ${dockerPrefix} \
  build backend-dev frontend-dev

  docker tag ${dockerPrefix}_frontend-dev ${dockerPrefix}_frontend-dev:${version}
  docker tag ${dockerPrefix}_backend-dev ${dockerPrefix}_backend-dev:${version}
  set +x
}

buildProdImages() {
  set -x  
  docker-compose \
    -f compose/production.yml \
    -f compose/db.yml \
    --project-directory . \
    -p ${dockerPrefix} \
    build --no-cache frontend

  docker-compose \
    -f compose/production.yml \
    -f compose/db.yml \
    --project-directory . \
    -p ${dockerPrefix} \
    build backend

  docker tag ${dockerPrefix}_frontend ${dockerPrefix}_frontend-prod:${version}
  docker tag ${dockerPrefix}_backend ${dockerPrefix}_backend-prod:${version}
  set +x
}
### Functions end

# Handle command line options
while getopts "h?m:v:" opt; do
  case $opt in
    m)
      mode=$OPTARG
      ;;
    v)
      version=$OPTARG
      versionOmitted=false
      ;;
    h|\?)
      show_help
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if [[ -z "${mode}" || ("${mode}" != "dev" && "${mode}" != "prod") ]]; then
  echo "Option -e must be either 'prod' or 'dev'"
  exit 1
fi

echo "Building version ${version} in '${mode}' mode."

# Main
echo
if [[ "${mode}" = "dev" ]]; then
  buildDevImages
elif [[ "${mode}" = "prod" ]]; then
  buildProdImages
else
  echo "Invalid input. Exiting."
  exit 1
fi

echo "Done, exiting."
