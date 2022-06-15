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
    PROJECT_NAME, GITHUB_REPO_URL, JENKINS_SERVER_URL, JENKINS_FOLDER_NAME, JENKINS_USERNAME, JENKINS_API_KEY = args[1], args[2], args[3], args[4], args[5], args[6]
else:
    PROJECT_NAME = os.environ.get("PROJECT_NAME")
    GITHUB_REPO_URL = os.environ.get("GITHUB_REPO_URL")
    JENKINS_SERVER_URL = os.environ.get("JENKINS_SERVER_URL")
    JENKINS_FOLDER_NAME = os.environ.get("JENKINS_FOLDER_NAME")
    JENKINS_USERNAME = os.environ.get("JENKINS_USERNAME")
    JENKINS_API_KEY = os.environ.get("JENKINS_API_KEY")

print(f"{PROJECT_NAME=} {GITHUB_REPO_URL=} {JENKINS_SERVER_URL=} {JENKINS_FOLDER_NAME=} {JENKINS_USERNAME=} {JENKINS_API_KEY=}")
print("RUNNING....")

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, "jenkins-multibranch-pipeline.xml.j2")

if not os.path.exists(filename):
    print("Unable to find multibranch pipeline xml template file. Exiting.", file=sys.stderr)
    sys.exit(1)
else:
    print("Found multibranch pipeline xml template file.")

# get jenkins crumb
headers = requests.structures.CaseInsensitiveDict()
headers["Content-Type"] = "application/x-www-form-urlencoded"
login_string = JENKINS_USERNAME + ":" + JENKINS_API_KEY
ut64 = base64.b64encode(bytes(login_string, encoding="utf8")).decode()
print("using auth header Basic " + ut64)
headers["Authorization"] = "Basic " + ut64

crumb_request_url = JENKINS_SERVER_URL + "/crumbIssuer/api/json"
print("requesting crumb from " + crumb_request_url)
crumb_resp = requests.post(crumb_request_url, headers=headers)
#TODO: check if crumb req successful
crumb = crumb_resp.json()["crumb"]
print("received Jenkins crumb " + crumb)

headers["Jenkins-Crumb"] = crumb

# parse GitHub info from repo url
parser = Parser(GITHUB_REPO_URL)
parsed = parser.parse()
for k, v in zip(parsed._fields, parsed):
    print(k, v)

# render xml template
ctx = SimpleTemplateContext({
    "template_gh_url": GITHUB_REPO_URL,
    "parsed_owner": parsed.owner,
    "parsed_name": parsed.name
})
renderer = TemplateRenderer(template_context=ctx)
result, values, error = renderer.render(filename)
print("Template rendered.\n", result)

#TODO: use sprout lib to render cred creation xml & send AWS creds to Jenkins cred store
#POST credentials.xml to $JENKINS_URL/<path to context>/credentials/store/<store id>/domain/<domain name>/createCredentials

# post xml file to jenkins
headers["Content-Type"] = "text/xml"
job_creation_url = JENKINS_SERVER_URL + "/job/" + JENKINS_FOLDER_NAME + "/createItem?name=" + parsed.name
print(f"{job_creation_url=}")
resp = requests.post(job_creation_url, headers=headers, data=result)
print("Job creation HTTP response code: " + str(resp.status_code))
