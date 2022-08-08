# Trivy security scan Github Actions template

The Trivy security scan template adds a GitHub Actions workflow that scans the repository with Trivy.

## Trivy

Trivy is a security scanner that allows you to easily spot vulnerabilities in your repositories. By default, Trivy can scan for vulnerabilities in

- Kubernetes
- Dockerfiles, Containerfiles
- Terraform
- CloudFormation
- Helm charts
- RBAC

More documentation about Trivy can found in [Trivy's documentation.](https://aquasecurity.github.io/trivy/)

## Inputs

- Scan Docker images:
    If Scan Docker images is enabled, the GitHub Actions workflow will build the container images defined in docker-compose.yml, and scan them using Trivy. This will often show a lot of vulnerabilities that are not relevant to the use case of Docker images, so it can easily be disabled in Sprout.
