#!/usr/bin/env python

import sys
import os
import requests
import base64

try:
    from services.templating.renderer import TemplateRenderer, SimpleTemplateContext
except ImportError:
    print("No Sprout services found. Do you have pluto/backend/endpoints/app in $PYTHONPATH and jinja2 installed? Exiting.", file=sys.stderr)
    sys.exit(1)
else:
    print("Sprout services found.")

try:
    from git_url_parse import Parser
except ImportError:
    print("Git URL parser not found. Do you have pluto-templates/executor_libraries/giturlparse in $PYTHONPATH? Exiting.", file=sys.stderr)
    sys.exit(1)
else:
    print("Git URL parser found.")

args=sys.argv
if len(args) > 1:
    [
        _,
        GITHUB_REPO_URL,
        JENKINS_SERVER_URL,
        JENKINS_FOLDER_NAME,
        JENKINS_USERNAME,
        JENKINS_API_KEY,
        DEPLOY_AWS_ID,
        DEPLOY_AWS_SECRET,
        DOCKER_USERNAME,
        DOCKER_PASSWORD,
        EKS_TAGS,
        GRAFANA_PASS,
        GOOGLE_OAUTH_ID,
        GOOGLE_OAUTH_SECRET,
        NODEMAILER_SMTP_HOST,
        NODEMAILER_USER, NODEMAILER_PASS
    ] = args
else:
    GITHUB_REPO_URL = os.environ.get("SPROUT_REPO_URL")
    JENKINS_SERVER_URL = os.environ.get("JENKINS_SERVER_URL")
    JENKINS_FOLDER_NAME = os.environ.get("JENKINS_FOLDER_NAME")
    JENKINS_USERNAME = os.environ.get("JENKINS_USERNAME")
    JENKINS_API_KEY = os.environ.get("JENKINS_API_KEY")
    DEPLOY_AWS_ID = os.environ.get("DEPLOY_AWS_ID")
    DEPLOY_AWS_SECRET = os.environ.get("DEPLOY_AWS_SECRET")
    DOCKER_USERNAME = os.environ.get("DOCKER_USERNAME", "")
    DOCKER_PASSWORD = os.environ.get("DOCKER_PASSWORD", "")
    EKS_TAGS = os.environ.get("EKS_TAGS", "")
    GRAFANA_PASS = os.environ.get("GRAFANA_PASS", "")
    GOOGLE_OAUTH_ID = os.environ.get("GOOGLE_OAUTH_ID", "")
    GOOGLE_OAUTH_SECRET = os.environ.get("GOOGLE_OAUTH_SECRET", "")
    NODEMAILER_SMTP_HOST = os.environ.get("NODEMAILER_SMTP_HOST", "")
    NODEMAILER_USER = os.environ.get("NODEMAILER_USER", "")
    NODEMAILER_PASS = os.environ.get("NODEMAILER_PASS", "")

print(f"{GITHUB_REPO_URL=} {JENKINS_SERVER_URL=} {JENKINS_FOLDER_NAME=} {JENKINS_USERNAME=}")
print("RUNNING....")

dirname = os.path.dirname(__file__)
pipeline_template = os.path.join(dirname, "jenkins-multibranch-pipeline.xml.j2")
usr_psw_template = os.path.join(dirname, "credentials-usr-psw.xml.j2")
secret_text_template = os.path.join(dirname, "credentials-secret-text.xml.j2")

if not os.path.exists(pipeline_template):
    print("Unable to find multibranch pipeline xml template file. Exiting.", file=sys.stderr)
    sys.exit(1)
else:
    print("Found multibranch pipeline xml template file.")

if not os.path.exists(usr_psw_template) or not os.path.exists(secret_text_template):
    print("Unable to find credential xml template files. Exiting.", file=sys.stderr)
    sys.exit(1)
else:
    print("Found credential xml template files.")

# get jenkins crumb
headers = requests.structures.CaseInsensitiveDict()
headers["Content-Type"] = "application/x-www-form-urlencoded"
login_string = JENKINS_USERNAME + ":" + JENKINS_API_KEY
ut64 = base64.b64encode(bytes(login_string, encoding="utf8")).decode()
headers["Authorization"] = "Basic " + ut64

crumb_request_url = JENKINS_SERVER_URL + ("/","")[JENKINS_SERVER_URL.endswith('/')] + "crumbIssuer/api/json"
print("requesting crumb from " + crumb_request_url)
crumb_resp = requests.post(crumb_request_url, headers=headers)

if crumb_resp.status_code != 200:
    print("Error requesting the crumb")
    sys.exit(1)

crumb = crumb_resp.json()["crumb"]
print("received Jenkins crumb")

headers["Jenkins-Crumb"] = crumb

parser = Parser(GITHUB_REPO_URL)
parsed = parser.parse()

# generate random websocket token
rand_b = os.urandom(32)
webhook_token = base64.urlsafe_b64encode(rand_b).decode('utf-8').replace('=', '')

ctx = SimpleTemplateContext({
    "ct_repo_url": GITHUB_REPO_URL,
    "ct_repo_owner": parsed.owner,
    "ct_repo_name": parsed.name,
    "ct_webhook_token": webhook_token
})
pipeline_renderer = TemplateRenderer(template_context=ctx)
pipeline_result, values, error = pipeline_renderer.render(pipeline_template)

aws_ctx = SimpleTemplateContext({
    "ct_id": parsed.name + "_aws_credentials",
    "ct_username": DEPLOY_AWS_ID,
    "ct_password": DEPLOY_AWS_SECRET
})
aws_renderer = TemplateRenderer(template_context=aws_ctx)
aws_creds_result, values, error = aws_renderer.render(usr_psw_template)

docker_ctx = SimpleTemplateContext({
    "ct_id": parsed.name + "_docker_credentials",
    "ct_username": DOCKER_USERNAME,
    "ct_password": DOCKER_PASSWORD
})
docker_renderer = TemplateRenderer(template_context=docker_ctx)
docker_creds_result, values, error = docker_renderer.render(usr_psw_template)

webhook_url = JENKINS_SERVER_URL + ("/","")[JENKINS_SERVER_URL.endswith('/')] + "multibranch-webhook-trigger/invoke?token=" + webhook_token
webhook_ctx = SimpleTemplateContext({
    "ct_id": parsed.name + "_webhook_url",
    "ct_secret": webhook_url
})
webhook_renderer = TemplateRenderer(template_context=webhook_ctx)
webhook_creds_result, values, error = webhook_renderer.render(secret_text_template)

eks_ctx =  SimpleTemplateContext({
    "ct_id": parsed.name + "_eks_credential",
    "ct_secret": EKS_TAGS
})
eks_renderer = TemplateRenderer(template_context=eks_ctx)
eks_creds_result, values, error = eks_renderer.render(secret_text_template)

grafana_ctx = SimpleTemplateContext({
    "ct_id": parsed.name + "_grafana_credential",
    "ct_secret": GRAFANA_PASS
})
grafana_renderer = TemplateRenderer(template_context=grafana_ctx)
grafana_creds_result, values, error = grafana_renderer.render(secret_text_template)

google_ctx = SimpleTemplateContext({
    "ct_id": parsed.name + "_google_credentials",
    "ct_username": GOOGLE_OAUTH_ID,
    "ct_password": GOOGLE_OAUTH_SECRET
})
google_renderer = TemplateRenderer(template_context=google_ctx)
google_creds_result, values, error = google_renderer.render(usr_psw_template)

nodemailer_host_ctx = SimpleTemplateContext({
    "ct_id": parsed.name + "_nodemailer_host_credential",
    "ct_secret": NODEMAILER_SMTP_HOST
})
nodemailer_host_renderer = TemplateRenderer(template_context=nodemailer_host_ctx)
nodemailer_host_creds_result, values, error = nodemailer_host_renderer.render(secret_text_template)

nodemailer_ctx = SimpleTemplateContext({
    "ct_id": parsed.name + "_nodemailer_credentials",
    "ct_username": NODEMAILER_USER,
    "ct_password": NODEMAILER_PASS
})
nodemailer_renderer = TemplateRenderer(template_context=nodemailer_ctx)
nodemailer_creds_result, values, error = nodemailer_renderer.render(usr_psw_template)

# post xml files to jenkins
headers["Content-Type"] = "application/xml"
job_creation_url = JENKINS_SERVER_URL + ("/","")[JENKINS_SERVER_URL.endswith('/')] + "job/" + JENKINS_FOLDER_NAME + "/createItem?name=" + parsed.name
print(f"{job_creation_url=}")
resp = requests.post(job_creation_url, headers=headers, data=pipeline_result)

if resp.status_code == 200:
    print("Job created successfully, posting credentials to its store now.")
    cred_creation_url = JENKINS_SERVER_URL + ("/","")[JENKINS_SERVER_URL.endswith('/')] + "job/" + JENKINS_FOLDER_NAME + "/job/" + parsed.name + "/credentials/store/folder/domain/_/createCredentials"
    print(f"{cred_creation_url=}")

    aws_cred_resp = requests.post(cred_creation_url, headers=headers, data=aws_creds_result)
    print("AWS Credential creation HTTP response code: " + str(aws_cred_resp.status_code))

    docker_cred_resp = requests.post(cred_creation_url, headers=headers, data=docker_creds_result)
    print("Docker Credential creation HTTP response code: " + str(docker_cred_resp.status_code))

    webhook_cred_resp = requests.post(cred_creation_url, headers=headers, data=webhook_creds_result)
    print("Webhook Credential creation HTTP response code: " + str(webhook_cred_resp.status_code))

    eks_cred_resp = requests.post(cred_creation_url, headers=headers, data=eks_creds_result)
    print("EKS Credential creation HTTP response code: " + str(eks_cred_resp.status_code))

    grafana_cred_resp = requests.post(cred_creation_url, headers=headers, data=grafana_creds_result)
    print("Grafana Credential creation HTTP response code: " + str(grafana_cred_resp.status_code))

    google_cred_resp = requests.post(cred_creation_url, headers=headers, data=google_creds_result)
    print("Google Credential creation HTTP response code: " + str(google_cred_resp.status_code))

    nodemailer_host_cred_resp = requests.post(cred_creation_url, headers=headers, data=nodemailer_host_creds_result)
    print("Nodemailer Host Credential creation HTTP response code: " + str(nodemailer_host_cred_resp.status_code))

    nodemailer_cred_resp = requests.post(cred_creation_url, headers=headers, data=nodemailer_creds_result)
    print("Nodemailer Credential creation HTTP response code: " + str(nodemailer_cred_resp.status_code))
else:
    print("There was a problem creating the Jenkins pipeline. Does it exist for this repository already? Check provided information & try again.")
