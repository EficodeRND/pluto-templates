Requirements for sucessfully deploying with this template:
- Access key & secret for an IAM user with the permissions listed in [deploy-aws-policy.json](../template/deploy-aws-policy.json)
- A certificate in ACM valid for the deployment URL. (ie. *.xyz.example.com for app.xyz.example.com)
- A Route53 hosted zone for the deployment URL domain.
