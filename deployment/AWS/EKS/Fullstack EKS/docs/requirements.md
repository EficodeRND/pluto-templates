# Requirements for sucessfully deploying with this template:
* Access key & secret for an IAM user with the permissions listed in [deploy-aws-policy.json](../template/deploy-aws-policy.json).
* A certificate in ACM valid for the deployment URL. (ie. *.xyz.example.com for app.xyz.example.com)
* A Route53 hosted zone for the deployment URL domain.
# Application template compatibility
* Currently compatible with zeroday fullstack application template & react w/ REST python.
* For other app templates, modify build-deploy.sh.j2 to conditionally include the right docker compose command.
* For other app templates, frontend must run on port 8000 and backend on port 9000.
