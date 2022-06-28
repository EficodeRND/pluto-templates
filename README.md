# Sprout templates repository
Sprout templates repository provides application, ci and deployment templates that are used by the Sprout
for creating new, fully functional code repositories that are immediately available for the actual development
work. Templates provide the base implementation, ci pipelines and the deployment of the components
to the desired target.

NOTE! If you are developing templates and any files or folders are missing from the repositories you are creating
from the template you should check that your template repository `.templating/.gitignore.template` is not preventing
the Sprout from pushing the contents of that directory / file.

Templates follow the best practises for the languages, language frameworks, version control, Devops way of working
and the deployment target systems.

All templates require a metadata file to provide additional information about the template. More information about the
metadata file can be found from the section [Template metadata file](#template-metadata-file)

Any combination of selected templates also produce a docker-compose.yml as long as the templates define the needed
information for the docker-compose.yml generation. More information about the needed configurations
can be found from the section
[Additional optional fields for application templates](#additional-optional-fields-for-application-templates)

Docker and docker-compose makes it easy to deliver portable development environment, and they may be used to deploy the
solution to e.g. test and production environments.

docker-compose.yml can be used for running the development environment locally or as a way to deploy the system to
target environments. More about the Docker and docker-compose can be found from the 
[Docker Documentation](https://docs.docker.com/)

Templates may utilise Jinja2 templating language for structuring the files of the generated repository contents.
More information about Jinja2 templating in Sprout can be found from the section [Jinja2 Templating](#jinja2-templating)
Any file ending with `.j2` extension under template folder or in sub folders of it (folder with `template.json` file)
will be treated as Jinja2 template.

Templates may require inputs from the user. Sprout provides a mechanism that allows templates to ask for such
information. More on defining the required inputs for a template can be found from
[Defining inputs for the templates](#defining-inputs-for-the-templates) 

## Template repository structure

Template repository is structured in different sections. The sections are defined by following directory structure
convention. Folder and file names are **case sensitive**. The directory stucture is parsed by both the Sprout backend
and frontend and the directory names are presented in different locations in the user interface also.

On the top level there is always the following directory structure

```
.templating
applications
ci
deployment
projects
```

Here's an example of functional template repository structure
```
.
├── .templating                                          # Generic template files for all repositories
│   ├── .gitignore.template                              # Template for creating the .gitignore for the repository
│   ├── README.md.j2                                     # README.md template for the repo. Jinja2 template
│   └── docker-compose.template.yml                      # Things that every docker-compose should contain
├── README.md                                            # This README file
├── applications                                         # 'applications' folder (component/tab in Sprout UI)
│   ├── component.json                                   # Meta data for the component folder (optional, contains description)
│   └── web_app                                          # Application type 'web-app'
│       ├── type.json                                    # Meta data for the type folder (optional, contains description)
│       │── frontend                                     # Application category 'frontend'
│       │   ├── category.json                            # Meta data for the category folder (optional, contains description)
│       │   └── react_with_rest                          # Application template 'react_with_rest'
│       │       ├── ci                                   # Application CI pipeline templates
│       │       │   └── GitHub                           # CI templates for GitHub
│       │       │       └── .github                      # Files & folders to copy to the new repo root
│       │       │           └── workflows
│       │       │               └── front...build.yml.j2 # Files with .j2 are treated as Jinja2 template file  
│       │       ├── template                             # Actual application template source code
│       │       │   ├── .env.development
│       │       │   ├── .gitignore
│       │       │   ├── Dockerfile
│       │       │   ├── README.md
│       │       │   ├── nginx.conf
│       │       │   ├── package.json.j2                  # Files with .j2 are treated as Jinja2 template file
│       │       │   ├── ...
│       │       └── template.json                        # Template meta data file
│       └── rest                                         # Application type 'rest'
│           └── python                                   # Application template 'python'  
│               ├── ci                                   # Application CI pipeline templates
│               │   └── GitHub                           # CI templates for GitHub
│               │       └── .github                      # Files & folders to copy to the new repo root
│               │           └── workflows
│               │               └── backend_build.yml
│               ├── template                             # Actual application template source code
│               │   ├── .gitignore
│               │   ├── Dockerfile
│               │   ├── prod_tasks.py
│               │   ├── requirements.txt
│               │   ├── rest_api.py
│               │   ├── tasks.py
│               │   └── ...
│               └── template.json                        # Template meta data file
├── ci                                                   # Generic CI templates
│   ├── all                                              # Application type independend CI templates
│   │   └── GitHub                                       # CI templates for GitHub
│   │       └── stale                                    # Template for 'stale' action  
│   │           ├── template                             # Template source code
│   │           │   └── .github                          # Files & folders to copy to the new repo root
│   │           │       └── workflows
│   │           │           ├── README.md
│   │           │           └── stale.yml
│   │           └── template.json                        # Template meta data file
│   └── web_app                                          # CI templates for the app type 'web_app'
│       └── acceptance                                   # Acceptance test templates
│               └── GitHub                               # Acceptance test template for GitHub
│                   └── robot_framework                  # Template for running Robot Framework on GitHub
│                       ├── ...                          # Files & folders to copy to the new repo root
│                       └── template.json                # Template meta data file
├── deployment                                           # Deployment templates
│   └── Heroku                                           # Deployment templates for 'Heroku'
│       ├── ci                                           # CI templates for running Heroku deployment
│       │   ├── GitHub                                   # CI depoyment template for GitHub
│       │   │   └── .github                              # Files & folders to copy to the new repo root
│       │   │       └── workflows
│       │   │           └── heroku_deploy.yml.j2         # Files with .j2 are treated as Jinja2 template file
│       │   └── Jenkins
│       │       ├── Jenkinsfile                          # CI depoyment template for Jenkins
│       │       └── template                             # Template source code (call from the pipeline)
│       │           └── ...                              # Files & folders to copy to the new repo root
│       └── template.json                                # Template meta data file
└── projects                                             # Project creation templates
    └── atlassian                                        # Templates for Atlassian stack
        └── jira                                         # Template for Jira project creation
            ├── template                                 # Template source code (called by the Sprout tempate executor)
            │   └── create_jira_project.py               # Python 3 or a shell script executed by the Sprout executor
            └── template.json                            # Template meta data file
```

### .templating
Contains generic templates that are always processed
- .gitignore.template (this is used to create the .gitignore to the new repository)
- docker-compose.template.yml (can be used for adding thing to generated docker-compose file that always should be
there)
- README.md.j2 (Jinja2 template file for generating the initial README.md for the newly created repository)

More information about Jinja2 templating in Sprout can be found from the section [Jinja2 Templating](#jinja2-templating)

### applications
The actual application / component templates are under 'applications' folder.
The folder may contain file named `component.json` which provides user-friendly description of the folder
```
{"description": "Applications"}
```

Inside the folder are the available
application types for this template repository. For example there could be:

```
web_app
executable
integration
```

Under the type folder (e.g. 'web_app') are the different component categories like 'frontend', 'rest' or 'graphql'
Inside the categories folders we finally find the actual component templates like 'python' or 'spring_boot'.
These template directories have further structure that is explained in the section
[Application template structure](#application-template-structure)

### ci
'ci' folder contains templates for creating CI pipelines. The folder contains two subdirectories. Special folder
named 'all' for generic CI pipeline templates and 'applications' for application specific CI pipeline templates.
The 'all' folder contains folders for each supported CI system. 'applications' folder follows the same structure as 
the top level 'applications' folder.

In addition to these folders the deployment template must have the template meta data file `template.json` More about
the meta data file can be found from the section [Template meta data file](#template-meta-data-file)

### deployment
'deployment' folder contains all the templates for the available deployment targets. Targets are defined by creating
a target specific folder like 'AWS' or 'Heroku' (**case sensitive**)

Inside the target specific folder there is 'ci' folder that contains all the supported CI systems
(like 'GitHub' or 'Jenkins') The contents of the provider specific folders are copied as they are to the repository.
So for example if 'GitHub' folder has the following file path: `.github/workflows/heroku_deploy.yml.j2`
the target repository will have file path `target_repo_root/.github/workflows/heroku_deploy.yml`

As with any of the template folders also deployment target specific template folder may have folder named 'template'
Contents of that folder are copied as is to the root of the newly created repository. Here you can add for example
any shell scripts you may need to call from the CI pipeline.

In addition to these folders the deployment template must have the template meta data file `template.json` More about
the meta data file can be found from the section [Template meta data file](#template-meta-data-file)

### projects
'projects' folder contains templates for the project level templating. They can be selected for execution after a
project has been created in the Sprout and they provide additional configuration options for the projects like
creating a Jira board for the project or adding an binary store for the project (like Artifactory).

Project level templates are executed by the Sprout Executor instead of the CI pipeline. The 'projects' folder structure
follows the same conventions as the other template folders. More information on the Sprout Executor templates can
be found from [The Sprout Executor templates](executor_templates.md)

## Application template structure
The applications folder contains different application type folders like `web_app`. It may also have a file
named `component.json` which provides user-friendly description of the component.
```
{"description": "Applications"}
```

The type folder may contain a file named `type.json` which provides user-friendly description
of the type.

```
{"description": "Web Applications"}
```

The type folder contains folders for different template categories (e.g. 'frontend' or 'rest')
The category folder may contain a file named `category.json` which provides user-friendly description
of the category.
```
{"description": "REST API Backends"}
```

Inside the category folder (e.g. 'frontend' or 'rest') lays the actual component templates. The template directory
can be named in any way. In the example we will use 'react_with_rest' for the frontend
and 'python' for the rest backend.

The component template consists of folders 'ci', 'template' and a template meta data file `template.json`. More about
the meta data file can be found from the section [Template meta data file](#template-meta-data-file)

Folder named 'ci' holds the CI provider specific folders. In provider specific folders are
the files needed to build a CI pipeline for that provider. The contents of the provider specific folders are copied as 
they are to the repository. So for example if 'GitHub' folder has the following file path:
`.github/workflows/backend_build.yml` the target repository will have file path
`target_repo_root/.github/workflows/backend_build.yml`

Folder named 'template' holds the actual component source code. In there you can put any files that for the source
code of your template. In any language with any build system supported by your CI pipeline templates.

Any file ending with `.j2` extension under template folder or in sub folders of it (folder with `template.json` file)
will be treated as Jinja2 template. More information about Jinja2 templating can be found from the section
[Jinja2 Templating](#jinja2-templating)

## Template metadata file
Template metadata file defines information about the template. Metadata is used together with the directory structure
to form the structure of the templates both in the UI and in the backend logic.

### Mandatory fields for all template metadata files
- name: The name of the template (presented in the UI)
- description: The long description of the template (presented in the UI)
- postActions: A JSON object listing any required actions that should be taken after the repository has been created.
May be `null` or an empty object. More information about post actions can be found from the section
[Defining post actions](#defining-post-actions)

### Additional mandatory fields for application templates
- appType: The application type. Current allowed values are 'backend' and 'frontend'

### Additional optional fields for application templates
- dockerComposeSnippet: A snippet of docker-compose file (in JSON format) that makes this component work when building
with docker-compose. More information about docker-compose can be found from
[Overview of Docker Compose](https://docs.docker.com/compose/)

If dockerComposeSnippet is defined there also must be working Dockerfile for the template. It is a strong
recommendation to have both Dockerfile and dockerComposeSnippet defined for any template that is suitable
to run in Docker. Defining Dockerfile and dockerComposeSnippet makes it easy to deliver portable development
environment, and they may be used to deploy the solution to e.g. test and production environments.

Example application template metadata file
```
{
  "name": "Python Flask backend with REST API",
  "description": "Pure Python REST API implemented with Flask framework.",
  "appType": "backend",
  "postActions": null,
  "dockerComposeSnippet": {
    "serviceName": {
      "build": {
        "context": ""
      },
      "environment": {
        "PORT": 8080
      },
      "ports": [
        "8080:8080"
      ]
    }
  }
}
```

### Additional mandatory fields for ci templates
There is no other mandatory fields than those that are mandatory for all template metadata files for the ci templates.

Example ci template metadata file
```
{
  "name": "GitHub stale action",
  "description": "Marks pull requests stale after certain amount of inactivity.",
  "postActions": {}
}
```
### Additional mandatory fields for deployment templates
There is no other mandatory fields than those that are mandatory for all template metadata files for the deployment
templates.

Example deployment template metadata file
```
{
  "name": "Heroku",
  "description": "Deploy your application stack to Heroku.",
  "inputs": [
    {
      "name": "Heroku account email address",
      "description": "Email address for accessing Heroku.",
      "type": "email",
      "target": "ci-secrets",
      "field": "HEROKU_EMAIL"
    },
    {
      "name": "Heroku API key",
      "description": "API key for accessing Heroku.",
      "type": "password",
      "target": "ci-secrets",
      "field": "HEROKU_API_KEY"
    },
    {
      "name": "Heroku Region",
      "description": "Heroku region where the applications should be deployed.",
      "type": "list",
      "target": "template",
      "field": "HEROKU_REGION",
      "options": [
        {
          "text": "Europe",
          "value": "eu"
        },
        {
          "text": "United States",
          "value": "us"
        }
      ]
    }
  ],
  "postActions": {
    "all": [],
    "GitHub": []
  }
}
```

### Defining post actions
Required manual post actions (if any) can be defined in the template metadata file. The post actions are listed both in
the Sprout UI on the summary page before and after creating a new repository and with the default README.md.j2
template in .templating/README.md.j2 they are also generated into the README file created to the new repository.

Post actions are deinfed as a JSON object in the template.json file. The post actions can have both generic and
ci provider specific sections.

Post actions are not mandatory and in such case they can be specified as `null` or as empty JSON object in the metadata
file.

Example definition of the post actions
```
"postActions": {
    "all": ['Follow best practises', 'Remember to write tests'],
    "GitHub": ['Keep your eye on the Dependabot alerts']
  }
```

### Defining inputs for the templates

In the template.json it is possible to define inputs needed for the templates.
- name: The name of the input
- description: Description (or a help text) for the input
- type:
  - When text input is required the type should be the html type for the input (i.e. text, url, email, password)
  - Drop down selection can be achieved by defining type 'list' and providing allowed options
    - Options is an array containing objects that should have field 'text' (display value) and 'value' 
    (the actual value passed to the template)
- target: The target of the input 
  - only passed for the template processing: 'template'
  - create e.g. GitHub secret with this key and value: 'ci-secrets'
  - Only passed as an environment variable to a executor template: 'executor'
- field: The field name (or secrets key) for the input

```
  "inputs": [
    {
      "name": "Heroku account email address",
      "description": "Email address for accessing Heroku.",
      "type": "email",
      "target": "ci-secrets",
      "field": "HEROKU_EMAIL"
    },
    {
      "name": "Heroku API key",
      "description": "API key for accessing Heroku.",
      "type": "password",
      "target": "ci-secrets",
      "field": "HEROKU_API_KEY"
    },
    {
      "name": "Heroku Region",
      "description": "Heroku region where the applications should be deployed.",
      "type": "list",
      "target": "template",
      "field": "HEROKU_REGION",
      "options": [
        {
          "text": "Europe",
          "value": "eu"
        },
        {
          "text": "United States",
          "value": "us"
        }
      ]
    }
  ]
```

## Jinja2 Templating
Template repositories supports Jinja2 templating. Any file under the template folder or under the template
folder subdirectories that ends with `.j2` extension are handled by the Sprout as Jinja2 template.
Documentation for the Jinja2 template language can be found from
[Template Designer Documentation](https://jinja.palletsprojects.com/en/3.0.x/templates/)

In addition to the basic Jinja2 templating engine the Sprout supports `jinja2.ext.do` extension. More about Jinja2
extensions can be found from [Extensions](https://jinja.palletsprojects.com/en/3.0.x/extensions/)

The Sprout provides the Jinja2 templates with certain amount of context information. The information contains for
example values that the user has entered to the template inputs by using the Sprout UI. More about available
values can be found from [Template context values](#template-context-values)

It is also possible to return values from the Jinja2 templates to the Sprout. This can be used for example
displaying the deployed application URLs on the repository details in Sprout UI. More information about return values
can be found from [Template return values](#template-return-values)

### Template context values
On the top level of the template context the following fields are available
- variables
  - Template run variables
- current_template
  - The template variables of the current template being executed
- template_variables
  - An array of template variables. Contains variables for all templates selected for this execution

On the template these values can be accessed in following way
```
{{ctx.current_template['parameters']['HEROKU_REGION']}}
{{ctx.template_variables['Heroku']['parameters']['HEROKU_REGION']}}
```

#### variables
- run_hash
  - 8 character hash generated for this templating execution
- app_templates
  - List of only app templates
- total_app_templates
  - How many 'applications' type templates are involved in this templating run

#### template_variables
Template variables can be retrieved from the template context by addressing the
template_variables dictionary with the template name

- repository_name
  - The name of the repository to be created
- template_name
  - Name of the template itself
- template_root
  - Path to the template root in the checked out template repository
- template_path
  - Full path to the template directory in the checked out template repository
- template_target_dir
  - Path to the folder for the new repository being created
- template_type
  - The type of the template ('applications', 'ci', 'deployment')
- is_app_template
  - Boolean value whether the template type is 'applications' or not
- meta_data
  - Complete meta data contents for the template
- parameters
  - The user entered values for the template inputs
- hash
  - 8 character hash generated for the template execution for this exact template
  

### Template return values
It is possible to return values from the template processing. The information returned is stored in to the
Sprout database as information related to the created repository. This way Sprout is able to present for example
deployed application URLs in the repository details of the Sprout UI.

return values can be added by using the Jinja2 do extension with the following syntax

```
{%- do add_return_value('value_name', {'value': 'return value', 'display_text': 'Desired text'}) -%}
```

For example:
```
{%- do add_return_value('url', {'value': 'https://' + template["heroku_app_name"] + '.herokuapp.com', 'display_text': 'Application URL'}) -%}
```

### Complete template file example
```
{%- set backend_url = namespace(value='') -%}
{%- for template_name in ctx.templates -%}
    {%- set template = ctx.templates[template_name] -%}
    {%- if template["is_app_template"] -%}
        {%- do template.update({'heroku_app_name': (("a" + template["hash"] + "-" + template["template_name"]).replace("_", "-")[:29]).lower()}) -%}
        {%- if template['meta_data'].get('appType', None) == 'backend' and backend_url.value == '' -%}
            {%- set backend_url.value = 'https://' + template["heroku_app_name"] + '.herokuapp.com' -%}
            {%- do add_return_value('backend_url', {'value': backend_url.value, 'display_text': 'Backend URL'}) -%}
        {%- elif template['meta_data'].get('appType', None) == 'frontend' -%}
            {%- do add_return_value('url', {'value': 'https://' + template["heroku_app_name"] + '.herokuapp.com', 'display_text': 'Application URL'}) -%}
        {%- endif -%}
    {%- endif -%}
{%- endfor -%}
name: Heroku Deployment
on:
  push:
    branches:
      - main
jobs:
    herokudeploy:
      name: Deploy to Heroku
      runs-on: ubuntu-latest
      steps:
        - name: Checkout the code
          uses: actions/checkout@v2
    {%- for template_name in ctx.templates -%}
        {%- set template = ctx.templates[template_name] -%}
            {%- if template["is_app_template"] -%}
            {% set app_name = template["heroku_app_name"] %}
        - name: Deploy {{app_name}}
          uses: akhileshns/heroku-deploy@v3.12.12
          with:
            heroku_api_key: {{ '${{ secrets.HEROKU_API_KEY }}' }}
            heroku_app_name: {{app_name}}
            heroku_email: {{ '${{ secrets.HEROKU_EMAIL }}' }}
            region: {{ctx.current_template['parameters']['HEROKU_REGION']}}
            usedocker: true
            appdir: {{template["template_name"]}}
            docker_build_args: |
              BACKEND_API_URL
          env:
            BACKEND_API_URL: '{{backend_url.value}}'
            {%- endif -%}
    {%- endfor -%}
```
