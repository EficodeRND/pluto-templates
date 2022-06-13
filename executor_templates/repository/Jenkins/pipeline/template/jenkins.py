#!/usr/bin/env python

import sys
import os
import json
import logging as log
import requests
import base64
# from utils.common import LogManager

if 'services' in locals():
    from services.templating.renderer import TemplateRenderer, SimpleTemplateContext
else:
    print("no sprout services found")
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

if __name__ == '__main__':
    print("RUNNING....")
    # log.info("Environment: %s", os.environ)

    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, "jenkins-multibranch-pipeline.xml.j2")

    if not os.path.exists(filename):
        print("File does not exist.")
    else:
        print("File exists.")
        with open(filename, 'r', encoding="utf8") as file:
          content = file.read().splitlines()

        for line in content:
            print(line)

headers = requests.structures.CaseInsensitiveDict()
headers["Content-Type"] = "application/x-www-form-urlencoded"
login_string=JENKINS_USERNAME+":"+JENKINS_API_KEY
ut64 = base64.b64encode(bytes(login_string, encoding='utf8')).decode()
print("using auth header Basic "+ut64)

headers["Authorization"] = "Basic "+str(ut64)

#get jenkins crumb
crumb_request_url=JENKINS_SERVER_URL + "/crumbIssuer/api/json"
print("requesting crumb from "+crumb_request_url)
crumb_resp = requests.post(crumb_request_url, headers=headers)
#TODO: check if crumb req successful
crumb=crumb_resp.json()["crumb"]
print("received Jenkins crumb "+crumb)

headers["Jenkins-Crumb"] = crumb 

#TODO: get parsed_repo_name and parsed_repo_owner from git url using "import parser from git_url_parse"

#TODO: use sprout lib to render job creation xml
#ctx = SimpleTemplateContext({'template_jenkins_folder': JENKINS_FOLDER_NAME})
#renderer = TemplateRenderer(template_context=ctx)
#result, values, error = renderer.render('test_data/test_template.txt.j2')
#print(f"Template rendered. Result: '%s' | Return values: %s", result, values)

headers["Content-Type"] = "text/xml"

#TODO: use sprout lib to render cred creation xml & send AWS creds to Jenkins cred store
#POST credentials.xml to $JENKINS_URL/<path to context>/credentials/store/<store id>/domain/<domain name>/createCredentials

#TODO: parse repo name from git url using "import parser from git_url_parse"

job_creation_url = JENKINS_SERVER_URL + "/job/"+PROJECT_NAME+"/createItem?name=parsed_repo_name"
with open(filename) as xml:
    resp = requests.post(job_creation_url, headers=headers, data=xml)
    print("Job creation HTTP response code: "+str(resp.status_code))
