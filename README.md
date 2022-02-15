# Sprout templates repository
Sprout templates repository provides application, ci and deployment templates that are used by the Sprout
for creating new, fully functional code repositories that are immediately available for the actual development
work. Templates provide the base implementation, ci pipelines and the deployment of the components
to the desired target.

Templates follow the best practises for the languages, language frameworks, version control, Devops way of working
and the deployment target systems.

Templates may utilise Jinja2 templating language for structuring the files of the generated repository contents.
More information about Jinja2 can be found from https://jinja.palletsprojects.com/en/3.0.x/templates/

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

### .templating
Contains generic templates that are always processed
- .gitignore.template (this is used to create the .gitignore to the new repository)
- docker-compose.template.yml (can be used for adding thing to generated docker-compose file that always should be
there)
- README.md.j2 (Jinja2 template file for generating the initial README.md for the newly created repository)

### applications
   The actual application / component templates are under applications folder. Inside the folder are the available
application types for this template repository. For example there could be:

```
web_app
executable
integration
```

Under the type folder (like 'web_app') are the different component categories like 'frontend', 'rest' or 'graphql'
Inside the categories folders we finally find the actual component templates like 'python' or 'spring_boot'.
These template directories has further structure also that is explained in the section
[Application template structure](#app-template-structure)

### ci
ci folder contains templates for creating CI pipelines. The folder contains two subdirectories. Special folder
named 'all' for generic CI pipeline templates and 'applications' for application specific CI pipeline templates.
The 'all' folder contains folders for each supported CI system. 'applications' folder follows the same structure as 
the top level applications folder.



## Application template structure {#app-template-structure}


## Defining inputs for the templates

In the template.json it is possible to define inputs needed for the templates.
- name: The name of the input
- description: Description (or a help text) for the input
- type:
  - When text input is required the type should be the html type for the input (ie. text, url, email, password)
  - Drop down selection can be achieved by defining type 'list' and providing allowed options
    - Options is an array containing objects that should have field 'text' (display value) and 'value' 
    (the actual value passed to the template)
- target: The target of the input 
  - only passed for the template processing: 'template'
  - create ie. GitHub secret with this key and value: 'ci-secrets'
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


