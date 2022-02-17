# Contributing to Sprout template repository
Contributing to the Sprout template repository can be done by forking the Sprout template repository and by issuing
a new pull request for the repository.

## Commits
CI will be in the future configured to use semantic-release action.
Commit messages should then be `<type>(<scope>): <short summary>` where type is one of the following:
```
build: Changes that affect the build system or external dependencies
ci: Changes to our CI configuration files and scripts
docs: Documentation only changes
feat: A new feature
fix: A bug fix
perf: A code change that improves performance
refactor: A code change that neither fixes a bug nor adds a feature
test: Adding missing tests or correcting existing tests
```

Scope should be one of the following:
```
template
tests
documentation
```
## Branches
Branches should be named as `<feature/task/bugfix>/description-here`
For example `feature/add-aws-deployment`

## Pull requests
If a pull request should close/fix/resolve an issue the description should have a line f.ex closes #2 
This will close issue number 2 when the PR is merged. More info on
https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue 
