# Sprout templates repository
Sprout templates repository provides application, ci and deployment templates that are used by the Sprout
for creating new, fully functional code repositories that are immediately available for the actual development
work. Templates provide the base implementation, ci pipelines and the deployment of the components
to the desired target.

Templates follow the best practises for the languages, language frameworks, version control, Devops way of working
and the deployment target systems.

Templates may utilise Jinja2 templating language for structuring the files of the generated repository contents.
More information about Jinja2 templating in Sprout can be found from the section [Jinja2 Templating](#jinja2-templating)
Any file ending with `.j2` extension under template folder or in sub folders of it (folder with `template.json` file)
will be treated as Jinja2 template.

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
```

Here's an example of functional template repository structure
```
.
├── .templating                                                     # Generic template files for all repositories
│   ├── .gitignore.template                                         # Template creating .gitignore for the repository
│   ├── README.md.j2                                                # README.md template for the repo. Jinja2 template
│   └── docker-compose.template.yml                                 # Things that every docker-compose should contain
├── README.md                                                       # This README file
├── applications                                                    # 'applications' folder (component/tab in Sprout UI)
│   └── web_app                                                     # Application type 'web-app'
│       ├── frontend                                                # Application category 'frontend'
│       │   └── react_with_rest                                     # Application template 'react_with_rest'
│       │       ├── ci                                              # Application CI pipeline templates
│       │       │   └── GitHub                                      # CI templates for GitHub
│       │       │       └── .github                                 # Files & folders to copy to the new repo root
│       │       │           └── workflows
│       │       │               └── frontend-test-lint-build.yml.j2 # Files with .j2 are treated as Jinja2 template file  
│       │       ├── template                                        # Actual application template source code
│       │       │   ├── .env.development
│       │       │   ├── .gitignore
│       │       │   ├── Dockerfile
│       │       │   ├── README.md
│       │       │   ├── nginx.conf
│       │       │   ├── package.json.j2                             # Files with .j2 are treated as Jinja2 template file
│       │       │   ├── ...
│       │       └── template.json                                   # Template meta data file
│       └── rest                                                    # Application type 'rest'
│           └── python                                              # Application template 'python'  
│               ├── ci                                              # Application CI pipeline templates
│               │   └── GitHub                                      # CI templates for GitHub
│               │       └── .github                                 # Files & folders to copy to the new repo root
│               │           └── workflows
│               │               └── backend_build.yml
│               ├── template                                        # Actual application template source code
│               │   ├── .gitignore
│               │   ├── Dockerfile
│               │   ├── prod_tasks.py
│               │   ├── requirements.txt
│               │   ├── rest_api.py
│               │   ├── tasks.py
│               │   └── ...
│               └── template.json                                   # Template meta data file
├── ci                                                              # Generic CI templates
│   ├── all                                                         # Application type independend CI templates
│   │   └── GitHub                                                  # CI templates for GitHub
│   │       └── stale                                               # Template for 'stale' action  
│   │           ├── template                                        # Template source code
│   │           │   └── .github                                     # Files & folders to copy to the new repo root
│   │           │       └── workflows
│   │           │           ├── README.md
│   │           │           └── stale.yml
│   │           └── template.json                                   # Template meta data file
│   └── applications                                                # Application type specific CI templates
│       └── web_app                                                 # CI templates for the app type 'web_app'
│           └── acceptance                                          # Acceptance test templates
│               └── GitHub                                          # Acceptance test template for GitHub
│                   ├── robot_framework                             # Template for running Robot Framework on GitHub
│                       ├── ...                                     # Files & folders to copy to the new repo root
│                       └── template.json                           # Template meta data file
└── deployment                                                      # Deployment templates
    └── Heroku                                                      # Deployment templates for 'Heroku'
        ├── ci                                                      # CI templates for running Heroku deployment
        │   ├── GitHub                                              # CI depoyment template for GitHub
        │   │   └── .github                                         # Files & folders to copy to the new repo root
        │   │       └── workflows
        │   │           └── heroku_deploy.yml.j2                    # Files with .j2 are treated as Jinja2 template file
        │   └── Jenkins
        │       ├── Jenkinsfile                                     # CI depoyment template for Jenkins
        │       └── template                                        # Template source code (call from the pipeline)
        │           └── ...                                         # Files & folders to copy to the new repo root
        └── template.json                                           # Template meta data file
```

### .templating
Contains generic templates that are always processed
- .gitignore.template (this is used to create the .gitignore to the new repository)
- docker-compose.template.yml (can be used for adding thing to generated docker-compose file that always should be
there)
- README.md.j2 (Jinja2 template file for generating the initial README.md for the newly created repository)

More information about Jinja2 templating in Sprout can be found from the section [Jinja2 Templating](#jinja2-templating)

### applications
The actual application / component templates are under 'applications' folder. Inside the folder are the available
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

## Application template structure
Inside the category folder (e.g. 'frontend' or 'rest') lies the actual component templates. The component directory
can be named in any way. In the example we will use 'react_with_rest' for the frontend
and 'python' for the rest backend.

The component template consists of folders 'ci', 'template' and a template meta data file. More about
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

## Template meta data file
Template meta data file defines information about the template.

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
Documentation for the Jinja2 template language can be found from https://jinja.palletsprojects.com/en/3.0.x/templates/

