#!/bin/bash
test -z "$DEPLOY_PROJECT_NAME" && test -f .env.deploy && \
  DEPLOY_PROJECT_NAME=$(grep -e '^DEPLOY_PROJECT_NAME=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_DOCKER_REGISTRY" && test -f .env.deploy && \
  DEPLOY_DOCKER_REGISTRY=$(grep -e '^DEPLOY_DOCKER_REGISTRY=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_PUBLIC_ADDRESS" && test -f .env.deploy && \
  DEPLOY_PUBLIC_ADDRESS=$(grep -e '^DEPLOY_PUBLIC_ADDRESS=.*' .env.deploy | cut -d '=' -f2)

URL=$DEPLOY_PUBLIC_ADDRESS

get_r53_id () {
  domain=$(echo $1|cut -f2- -d.)
  aws route53 list-hosted-zones --query "HostedZones[?contains(Name, '$domain')].Id | [0]" --output text
}

dockerPrefix="${DEPLOY_PROJECT_NAME}"
helmConfigDirectory="./helm/config"
helmConfigFile="development.yaml" # Modified depending mode

mode="dev"
namespace="default"
version=$(node -p "require('./package.json').version")
versionOmitted=true
force=false

set -e

### Functions
function show_help() {
cat <<EOF
Usage: deploy.sh [OPTION]
Deploy images with helm. Modifies ./helm/config/ files to match the deployment.
The docker images must be in registry in a path specified with mode (-m)
and version. For Example:
    ${DEPLOY_DOCKER_REGISTRY}/dev/frontend:1.2.3

Note: - Push images first with push.sh script.
      - Set kubectl context to point at correct cluster.
      - Initialize the cluster according to instructions in readme.md.
      - Requires helm version 3.0.0 or greater.

Options
  -m MODE             Deploy mode, MODE can be 'dev' (default
                      if omitted) or 'prod'. dev mode will use development
                      helm configuration, prod production or staging
                      configuration depending on namespace (see below).
  -n NAMESPACE        Kubernetes namespace to deploy to. Default 'default'
                      if omitted. Production and staging environments
                      should be installed using 'prod' deploy mode (see above).
                      prod -mode deployments to staging namespace will use
                      staging helm configuration, otherwise production.
  -p ADDRESS          Public URL or IP address for service. If omitted, uses
                      default value in script.
  -v VERSION          Version to deploy.
  -f                  Do not prompt for confirmation.
EOF
}

helmInstallIngress() {
  if ! kubectl get namespace "ingress-nginx" 1> /dev/null; then
    echo
    echo "Install ingress-nginx and Create Route53 records"
    echo
    kubectl apply -f helm/ingress-nginx

    # wait until Amazon ELB from ingress-nginx is ready
    sleep 1m
  fi

  DNS_NAME=$(kubectl --namespace=ingress-nginx get svc | grep LoadBalancer | tr -s ' ' | cut -d ' ' -f4)
  LB_NAME=$(awk -F- '{print $1}' <<< $DNS_NAME)
  LB_HOSTED_ZONE_ID=$(aws elb describe-load-balancers --load-balancer-name $LB_NAME --query LoadBalancerDescriptions[0].CanonicalHostedZoneNameID --output text)

  mkdir -p ./tmp
  cp route53-records.json ./tmp/file.json
  sed -i "s/URL/$URL/g" ./tmp/file.json
  sed -i "s/ELB_HOSTED_ZONE_ID/$LB_HOSTED_ZONE_ID/g" ./tmp/file.json
  sed -i "s/ELB_DNS/$DNS_NAME/g" ./tmp/file.json

  zone_id=$(get_r53_id $URL)
  aws route53 change-resource-record-sets --hosted-zone-id $zone_id --change-batch file://tmp/file.json
  rm ./tmp/file.json
}

helmInstallApp() {
  if ! kubectl get namespace "${namespace}" 1> /dev/null; then
    kubectl create namespace "${namespace}"
  fi

  frontendImage="${DEPLOY_DOCKER_REGISTRY}/${mode}/frontend"
  backendImage="${DEPLOY_DOCKER_REGISTRY}/${mode}/backend"

  # Create secrets

  set +x

  if [[ -n "$FACEBOOK_APP_SECRET" ]] || [[ -n "$GOOGLE_OAUTH_SECRET" ]]
  then
    kubectl create secret generic oauth-secret \
    --namespace=${namespace} \
    --from-literal=FACEBOOK_APP_SECRET=$FACEBOOK_APP_SECRET \
    --from-literal=GOOGLE_OAUTH_SECRET=$GOOGLE_OAUTH_SECRET \
    --dry-run=client \
    -o yaml | kubectl apply -f -
  fi

  if [[ -n "$FACEBOOK_APP_ID" ]] || [[ -n "$GOOGLE_OAUTH_ID" ]]
  then
    kubectl create secret generic oauth-id-secret \
    --namespace=${namespace} \
    --from-literal=FACEBOOK_APP_ID=$FACEBOOK_APP_ID \
    --from-literal=GOOGLE_OAUTH_ID=$GOOGLE_OAUTH_ID \
    --dry-run=client \
    -o yaml | kubectl apply -f -
  fi

  if [[ -n "$NODEMAILER_USER" ]]
  then
    kubectl create secret generic nodemailer-secret \
    --namespace=${namespace} \
    --from-literal=NODEMAILER_SMTP_HOST=$NODEMAILER_SMTP_HOST \
    --from-literal=NODEMAILER_USER=$NODEMAILER_USER \
    --from-literal=NODEMAILER_PASS=$NODEMAILER_PASS \
    --dry-run=client \
    -o yaml | kubectl apply -f -
  fi

  set -x

  helm upgrade --install \
    -f "${helmConfig}" \
    --set backend.image.tag="${version}",frontend.image.tag="${version}" \
    --set backend.image.repository="${backendImage}",frontend.image.repository="${frontendImage}" \
    --set global.host="${DEPLOY_PUBLIC_ADDRESS}" \
    "${DEPLOY_PROJECT_NAME}" \
    ./helm/app \
    --namespace "${namespace}"
}

### Functions end

# Handle command line options
while getopts "h?m:n:v:p:f" opt; do
  case $opt in
    m)
      mode="$OPTARG"
      ;;
    n)
      namespace="$OPTARG"
      ;;
    v)
      version="$OPTARG"
      versionOmitted=false
      ;;
    p)
      DEPLOY_PUBLIC_ADDRESS="$OPTARG"
      URL=$DEPLOY_PUBLIC_ADDRESS
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

if [[ -z "${mode}" || ("${mode}" != "dev" && "${mode}" != "prod") ]]; then
  echo "Option -m must be either 'prod' or 'dev'"
  exit 1
fi

if [[ "${mode}" = "prod" ]]; then
  if [[ "${namespace}" = "staging" ]]; then
    helmConfigFile="staging.yaml"
  else
    helmConfigFile="production.yaml"
  fi
fi

if [[ "${namespace}" != "production" && "${namespace}" != "default" ]]; then
  DEPLOY_PUBLIC_ADDRESS="${namespace}-${DEPLOY_PUBLIC_ADDRESS}"
fi

helmConfig="${helmConfigDirectory}/${helmConfigFile}"

if ! kubectl cluster-info 1> /dev/null; then
  echo "Unable to get cluster-info. Is kubectl current-context correctly?"
  exit 1
fi

if ! kubectl get namespace "${namespace}" 1> /dev/null; then
  echo "Namespace ${namespace} does not exist. Did you create and initialize it? See ./helm/README.md"
  exit 1
fi

if ! kubectl get secret img-pull-secret -n "${namespace}" 1> /dev/null; then
  echo "img-pull-secret must be created before deploying to namespace ${namespace}. See ./helm/README.md"
  exit 1
fi

kubectl get secret img-pull-secret --namespace=${namespace} -o go-template='{{range $d := .data}}{{$d|base64decode}}{{"\n\n"}}{{end}}' \
  | sed 's/"/\n"\n/g' \
  | grep "${DEPLOY_DOCKER_REGISTRY}" \
  || ( \
    echo "The docker registry URL on the cluster differs from the URL configured in '.deploy.env', which is '${DEPLOY_DOCKER_REGISTRY}'." \
    && echo "Running ' kubectl get secret img-pull-secret -o go-template='{{range \$d := .data}}{{\$d|base64decode}}{{end}}' ' will show the current secret." \
    && echo "See README.md for more about setting img-pull-secret" \
    && exit 1 \
  )

echo
echo "Deploying version ${version} in '${mode}' mode to namespace ${namespace} with address ${DEPLOY_PUBLIC_ADDRESS} in cluster"
kubectl cluster-info
echo "Current kubectl context is " eval kubectl config current-context
echo
if ! ${force} ; then
  read -p "Continue? [y/n] " -n 1 -r
  if [[ ! ${REPLY} =~ ^[Yy]$ ]]; then
    exit 0;
  fi
fi

# Main
set -x

helmInstallIngress
helmInstallApp

set +x

echo "Done, exiting."