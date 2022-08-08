# Slack notifications for GitHub Actions

Sends notifications to Slack with the status of GitHub Actions after they run.

## Pre-requistes

For the notifications to work, you need an Incoming Webhook URL. Follow this guide (steps 1-3) to set things up and obtain one: https://api.slack.com/messaging/webhooks

## Adding Slack notifications to a workflow

To add Slack notifications to a GitHub Actions workflow, add the workflow name to the `workflows` array on `.github/workflows/slack-notifications.yml`:

```
name: Slack notifications
on:
  workflow_run:
    workflows:
      - build-lint-test
      - Another workflow
# etc.
```

This is documented as a **Post Action** in the template.

## Inputs
  - Slack Webhook URL: Paste here the Incoming Webhook URL you obtained. It will be stored as a GitHub secret.
