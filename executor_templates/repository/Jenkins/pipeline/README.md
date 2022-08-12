# Setting up a Jenkins CI & CD Pipeline automatically for a GitHub repository
Make sure you have authorized https://github.com/apps/sprout-jenkins-github-app to setup webhooks on your behalf to your GitHub account & scan your repos.

This script and templating is supposed to run in the Sprout executor environment. To test this script locally, you need to:

```
export PYTHONPATH=/path/to/pluto/backend/endpoints/app:path/to/pluto-templates/executor_libraries
```

The arguments for `jenkins.py` explained:

		[1] GITHUB_REPO_URL: A URL to any GitHub repository where Sprout Jenkins GitHub app has been installed.
		[2] JENKINS_SERVER_URL: A URL pointing to your Jenkins server, such as ci.eficode.io or ci.rootdemo.eficode.io. The Jenkins server must have the Sprout Jenkins GitHub app private key installed as "SproutJenkinsGitHubApp".
		[3] JENKINS_FOLDER_NAME: The directory in which the multibranch pipeline will be created in on the Jenkins server.
		[4] JENKINS_USERNAME: Your Jenkins username from the server.
		[5] JENKINS_API_KEY: Press your account name at the top of Jenkins with the profile icon. Press configure. Press add new token under API Token. Press copy.
		[6,7] DEPLOY_AWS_ID, DEPLOY_AWS_SECRET: Access Key ID and Secret Access Key from AWS. These will be sent to the Jenkins credential store.
		[8,9] DOCKER_USERNAME, DOCKER_PASSWORD: Docker username and password for logging in to the registry where the images will be pushed. Only matters when using a custom Docker registry. These will be sent to the Jenkins credential store.
		[10] EKS_TAGS: Comma separated list of additional tags for creating the EKS cluster. Sample: Contact=john.doe@eficode.com,Department=devops-fi-hki. This will be sent to the Jenkins credential store.
		[11] GRAFANA_PASS: Strong password to be used for authenticating to the Grafana frontend available at grafana-[PUBLIC ADDRESS]. The default username is admin. Required if using Grafana. This will be sent to the Jenkins credential store.
