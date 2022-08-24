#!/bin/bash

function show_help() {
cat <<EOF
Usage: setup-aws.sh [OPTION]

Sets up AWS EKS and ECR for the deployment. 
Requires the AWS CLI to be logged in. 
The options can also 
be defined as environment variables.

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
    
  -u DOCKER_USERNAME  Username for logging in to the Docker registry. 

  -w DOCKER_PASSWORD  Password for logging in to the Docker registry.

  -e DOCKER_EMAIL     Email for logging in to the Docker registry.

  -t EKS_TAGS         Tags to add to the EKS cluster, if it is created.
EOF
}

set -e

test -z "$DEPLOY_PROJECT_NAME" && test -f .env.deploy && \
  DEPLOY_PROJECT_NAME=$(grep -e '^DEPLOY_PROJECT_NAME=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_DOCKER_REGISTRY" && test -f .env.deploy && \
  DEPLOY_DOCKER_REGISTRY=$(grep -e '^DEPLOY_DOCKER_REGISTRY=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_DOCKER_REGISTRY_TYPE" && test -f .env.deploy && \
  DEPLOY_DOCKER_REGISTRY_TYPE=$(grep -e '^DEPLOY_DOCKER_REGISTRY_TYPE=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_PUBLIC_ADDRESS" && test -f .env.deploy && \
  DEPLOY_PUBLIC_ADDRESS=$(grep -e '^DEPLOY_PUBLIC_ADDRESS=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_AWS_REGION" && test -f .env.deploy && \
  DEPLOY_AWS_REGION=$(grep -e '^DEPLOY_AWS_REGION=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_AWS_EKS_CLUSTER" && test -f .env.deploy && \
  DEPLOY_AWS_EKS_CLUSTER=$(grep -e '^DEPLOY_AWS_EKS_CLUSTER=.*' .env.deploy | cut -d '=' -f2)

test -z "$NODEGROUP_NAME" && test -f .env.deploy && \
  NODEGROUP_NAME=$(grep -e '^NODEGROUP_NAME=.*' .env.deploy | cut -d '=' -f2)

test -z "$CLUSTER_NODE_TYPE" && test -f .env.deploy && \
  CLUSTER_NODE_TYPE=$(grep -e '^CLUSTER_NODE_TYPE=.*' .env.deploy | cut -d '=' -f2)

test -z "$DEPLOY_MODE" && \
    DEPLOY_MODE=dev

test -z "$DEPLOY_NAMESPACE" && \
    DEPLOY_NAMESPACE=default

# Handle command line options
while getopts "h?m:n:p:u:w:e:t:" opt; do
  case $opt in
    m)
      DEPLOY_MODE="$OPTARG"
      ;;
    n)
      DEPLOY_NAMESPACE="$OPTARG"
      ;;
    p)
      DEPLOY_PUBLIC_ADDRESS="$OPTARG"
      ;;
    u)
      DOCKER_USERNAME="$OPTARG"
      ;;
    w)
      DOCKER_PASSWORD="$OPTARG"
      ;;
    e)
      DOCKER_EMAIL="$OPTARG"
      ;;
    t)
      EKS_TAGS="$OPTARG"
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

set -x


certificateDomain=$(echo $DEPLOY_PUBLIC_ADDRESS|cut -f2- -d.)

certificateArn=$(aws acm list-certificates --query CertificateSummaryList[].[CertificateArn,DomainName]  --output text | grep $certificateDomain | cut -f1)

if [ -z "$certificateArn" ]
then
      echo "Could not find certificateArn . Check that you have a certificate in ACM for the public deployment address. "
      exit 1
fi

echo $certificateArn

sed "s#%CERTNAME%#$certificateArn#g" ./helm/ingress-nginx/09-controller-service.yaml.template > ./helm/ingress-nginx/09-controller-service.yaml

if [ "$DEPLOY_DOCKER_REGISTRY_TYPE" == 'ecr' ]
then
    aws ecr describe-repositories --repository-name $DEPLOY_PROJECT_NAME/$DEPLOY_MODE/frontend >> /dev/null && \
    ECR_EXISTS=true || \
    ECR_EXISTS=false
    aws ecr describe-repositories --repository-name $DEPLOY_PROJECT_NAME/$DEPLOY_MODE/backend >> /dev/null || \
    ECR_EXISTS=false

    if [ "$ECR_EXISTS" == false ]
    then
        echo Creating ECR repo..
        aws ecr create-repository --repository-name $DEPLOY_PROJECT_NAME/$DEPLOY_MODE/frontend
        aws ecr create-repository --repository-name $DEPLOY_PROJECT_NAME/$DEPLOY_MODE/backend
    else
        echo ECR repository found!
    fi

    # If using ECR, the Docker credential environment variables have to be set here, 
    # since the ECR Docker login is only possible using a temporary password that expires in 12 hours

    set +x

    DOCKER_USERNAME='AWS'
    DOCKER_PASSWORD=$(aws ecr get-login-password --region $DEPLOY_AWS_REGION)
    AWS_ID=$(aws sts get-caller-identity --query Account --output text)
    DEPLOY_DOCKER_REGISTRY="$AWS_ID.dkr.ecr.$DEPLOY_AWS_REGION.amazonaws.com/$DEPLOY_PROJECT_NAME"
    DOCKER_EMAIL="$AWS_ID@example.com"

    export DOCKER_USERNAME
    export DOCKER_PASSWORD
    export AWS_ID
    export DEPLOY_DOCKER_REGISTRY
    export DOCKER_EMAIL

    if [ -n "$GITHUB_ACTIONS" ] && [ "$GITHUB_ACTIONS" == true ]
    then
        echo "::add-mask::$DOCKER_PASSWORD"
        echo "::add-mask::$AWS_ID"
        echo "::add-mask::$DEPLOY_DOCKER_REGISTRY"
        echo "::add-mask::$DOCKER_EMAIL"
        {
            echo DOCKER_USERNAME=AWS
            echo DOCKER_PASSWORD=$DOCKER_PASSWORD
            echo AWS_ID=$AWS_ID
            echo DEPLOY_DOCKER_REGISTRY=$DEPLOY_DOCKER_REGISTRY
            echo DOCKER_EMAIL=$DOCKER_EMAIL
        } >> $GITHUB_ENV
    fi
    docker login https://$DEPLOY_DOCKER_REGISTRY -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
else
  set +x
  docker login $DEPLOY_DOCKER_REGISTRY -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
  set -x
fi

aws eks describe-cluster --name $DEPLOY_AWS_EKS_CLUSTER >> /dev/null && \
    CLUSTER_EXISTS=true || \
    CLUSTER_EXISTS=false

if [ "$CLUSTER_EXISTS" == false ]
then
    echo Installing eksctl...
    curl -sS --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | \
        tar xz -C /tmp

    echo Creating cluster. This might take some time...
    /tmp/eksctl create cluster \
        --name $DEPLOY_AWS_EKS_CLUSTER \
        --region $DEPLOY_AWS_REGION \
        --nodegroup-name $(test -z "$NODEGROUP_NAME" && echo "$DEPLOY_AWS_EKS_CLUSTER-ng" || echo "$NODEGROUP_NAME") \
        --node-type $CLUSTER_NODE_TYPE \
        --nodes 1 \
        --nodes-min 1 \
        --nodes-max 1 \
        --managed \
        --version=1.22 \
        $(test -z "$EKS_TAGS" && echo "" || echo "--tags $EKS_TAGS")
fi

# Update kubectl config so that kubectl knows what cluster to access

aws eks update-kubeconfig --name $DEPLOY_AWS_EKS_CLUSTER

kubectl create namespace "$DEPLOY_NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret docker-registry img-pull-secret \
    --namespace=$DEPLOY_NAMESPACE \
    --docker-server=$DEPLOY_DOCKER_REGISTRY \
    --docker-username="$DOCKER_USERNAME" \
    --docker-password="$DOCKER_PASSWORD" \
    --docker-email="$DOCKER_EMAIL" \
    --save-config \
    --dry-run=client \
    -o yaml | kubectl apply -f -
