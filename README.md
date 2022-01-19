# pluto-templates
Pluto templates repository

## Defining inputs for the templates

In the template.json it is possible to define inputs needed for the templates.

- name: The name of the input
- description: Description (or a help text) for the input
- type: The html type for the input
- target: The target of the input 
  - only passed for the template: 'template'
  - create ie. GitHub secret with this key and value: 'ci-secrets'
- field: The field name (or secrets key) for the input

```
  "inputs": [
    {
      "name": "Heroku account email address",
      "description": "Email address for accessing Heroku",
      "type": "email",
      "target": "ci-secrets",
      "field": "HEROKU_EMAIL"
    },
    {
      "name": "Heroku API key",
      "description": "API key for accessing Heroku",
      "type": "password",
      "target": "ci-secrets",
      "field": "HEROKU_API_KEY"
    },
    {
      "name": "External Service URL",
      "description": "URL for third party service",
      "type": "url",
      "target": "template",
      "field": "THIRD_PARTY_SERVICE_URL"
    }
  ]
```
