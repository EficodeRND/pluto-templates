#!/bin/bash

test -z "$DEPLOY_PROJECT_NAME" && test -f .env.deploy && \
  DEPLOY_PROJECT_NAME=$(grep -e '^DEPLOY_PROJECT_NAME=.*' .deploy.env | cut -d '=' -f2)

test -z "$DEPLOY_DOCKER_REGISTRY" && test -f .env.deploy && \
  DEPLOY_DOCKER_REGISTRY=$(grep -e '^DEPLOY_DOCKER_REGISTRY=.*' .deploy.env | cut -d '=' -f2)


dockerLocalEnvironment="${DEPLOY_PROJECT_NAME}"
mode="dev"
version=$(node -p "require('./package.json').version")
versionOmitted=true
force=false

set -e

function show_help() {
cat <<EOF
Usage: push.sh [OPTION]
Push docker images to repository. Run 'docker login' beforehand.

Docker images must have been named locally with ${dockerLocalEnvironment},
deploy mode and selected version, for example:
    '${dockerLocalEnvironment}_frontend-dev:1.2.3'. 

Options
  -m MODE             Deploy mode, MODE can be 'dev' (default
                      if omitted) or 'prod'.
  -v VERSION          Version to push (defaults to package.json version if
                      omitted).
  -f                  Do not prompt for confirmation.
EOF
}

pushImage() {
  local image="${1}"
  set -x
  docker push ${image}
  if [ "$?" -ne 0 ]; then
    echo "Docker push failed. Did you remember to increment the version number?"
    exit 1
  fi
  set +x
}

# Handle command line options
while getopts "h?m:v:f" opt; do
  case $opt in
    m)
      mode=$OPTARG
      ;;
    v)
      version=$OPTARG
      versionOmitted=false
      ;;
    f) 
      force=true
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

echo $DEPLOY_PROJECT_NAME

if [ -z "$DEPLOY_PROJECT_NAME" ];
then
  echo "Environment variable DEPLOY_PROJECT_NAME missing."
  exit 1
fi

if [ -z "$DEPLOY_DOCKER_REGISTRY" ];
then
  echo "Environment variable DEPLOY_DOCKER_REGISTRY missing."
  exit 1
fi

if [[ -z "${mode}" || ("${mode}" != "dev" && "${mode}" != "prod") ]]; then
  echo "Option -e must be either 'prod' or 'dev'"
  exit 1
fi

echo "Tagging and pushing ${mode} images with version ${version}."
echo
if [[ -z "${force}" || ("${mode}" != "dev" && "${mode}" != "prod") ]]; then
  read -p "Continue? [y/n] " -n 1 -r
  if [[ ! ${REPLY} =~ ^[Yy]$ ]]; then
    exit 0;
  fi
fi

# Main
echo
set -x

localFrontendImage="${dockerLocalEnvironment}_frontend-${mode}:${version}"
localBackendImage="${dockerLocalEnvironment}_backend-${mode}:${version}"
frontendImage="${DEPLOY_DOCKER_REGISTRY}/${mode}/frontend:${version}"
backendImage="${DEPLOY_DOCKER_REGISTRY}/${mode}/backend:${version}"

docker tag "${localFrontendImage}" "${frontendImage}"
docker tag "${localBackendImage}" "${backendImage}"
pushImage "${frontendImage}"
pushImage "${backendImage}"

set +x
echo
echo "Done, exiting."
