#!/bin/bash

test -z "$DEPLOY_PUBLIC_ADDRESS" && test -f .env.deploy && \
  DEPLOY_PUBLIC_ADDRESS=$(grep -e '^DEPLOY_PUBLIC_ADDRESS=.*' .env.deploy | cut -d '=' -f2)

function show_help() {
cat <<EOF
Usage: install-monitoring.sh [OPTION]

Installs Grafana, Grafana Loki and Prometheus to the cluster. 
The Grafana dashboard will be available at grafana-$DEPLOY_PUBLIC_ADDRESS
Note: - Run setup-aws.sh first or
        - Set kubectl context to point at correct cluster.
        - Initialize the cluster according to instructions in readme.md.
      - Requires helm version 3.0.0 or greater.

Options
  -p PASSWORD         Password for the Grafana admin user,
                      read from \$GRAFANA_PASS if omitted.

  -P                  Read password from stdin.

  -a ADDRESS          Public URL or IP address for service. Do not include the grafana- part here. If omitted, uses
                      default value in script.

  -l                  Local installation, does not create ingress for Grafana. Grafana will only be
                      available through port forwarding using the command kubectl port-forward (More information about this in README.md).

EOF
}

test -z "$DEPLOY_MONITORING_INGRESS" && test -f .env.deploy && \
  DEPLOY_MONITORING_INGRESS=$(grep -e '^DEPLOY_MONITORING_INGRESS=.*' .env.deploy | cut -d '=' -f2)


[[ "${DEPLOY_MONITORING_INGRESS,,}" == "false" ]] && installIngress=false || installIngress=true

pass=$GRAFANA_PASS


# Handle command line options
while getopts "h?p:a:Pl" opt; do
  case $opt in
    p)
      pass=$OPTARG
      ;;
    P)
      pass=$(cat -)
      ;;
    l)
      installIngress=false
      ;;
    a)
      DEPLOY_PUBLIC_ADDRESS="$OPTARG"
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

get_r53_id () {
  domain=$(echo "$1"|cut -f2- -d.)
  aws route53 list-hosted-zones --query "HostedZones[?contains(Name, '$domain')].Id | [0]" --output text
}

# Main

if ! kubectl get namespace monitoring 1> /dev/null; 
then
  kubectl create namespace monitoring
fi

# Only install the secret if the password is defined, this allows running the script without knowing the password

if [[ -n "$pass" ]]
then
  echo Creating Grafana secret...
  kubectl create secret generic grafana \
  --namespace=monitoring \
  --from-literal=admin-user=admin \
  --from-literal=admin-password="$pass" \
  --from-literal=ldap-toml="" \
  --dry-run=client \
  -o yaml | kubectl apply -f -
fi

set -x

helm repo add prometheus https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts

cd helm/monitoring-logging/monitoring-chart && \
  helm dependency build && \
  helm upgrade --install monitoring \
  . \
  --namespace monitoring \
  --set global.installIngress=${installIngress} \
  --set global.host="${DEPLOY_PUBLIC_ADDRESS}"

cd ../../../

if [[ "${installIngress}" == "true" ]]
then
  DNS_NAME=$(kubectl --namespace=ingress-nginx get svc | grep LoadBalancer | tr -s ' ' | cut -d ' ' -f4)
  LB_NAME=$(awk -F- '{print $1}' <<< "$DNS_NAME")
  LB_HOSTED_ZONE_ID=$(aws elb describe-load-balancers --load-balancer-name "$LB_NAME" --query LoadBalancerDescriptions[0].CanonicalHostedZoneNameID --output text)

  mkdir -p ./tmp
  cp grafana-route53-records.json ./tmp/file.json
  sed -i "s/URL/$DEPLOY_PUBLIC_ADDRESS/g" ./tmp/file.json
  sed -i "s/ELB_HOSTED_ZONE_ID/$LB_HOSTED_ZONE_ID/g" ./tmp/file.json
  sed -i "s/ELB_DNS/$DNS_NAME/g" ./tmp/file.json

  aws route53 change-resource-record-sets --hosted-zone-id $(get_r53_id "$DEPLOY_PUBLIC_ADDRESS") --change-batch file://tmp/file.json
  rm ./tmp/file.json
fi

set +x