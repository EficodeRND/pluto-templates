# The Sprout executor templates

The Sprout executor templates can be either Python 3 or Shell scripts. They are executed by the Sprout itself instead
of the CI pipeline like the application (build/test/packaging), CI or deployment templates.

Shell script based executor templates are currently limited to the AWS lambda shell environment (Amazon Linux 2)

With Python 3 executor template the full Python 3 support is available including the Sprout python modules.
Following Python 3 libraries are available in addition to the Sprout modules.

```
aws-wsgi
flask
flask-cors
requests
gitpython
pyyaml
jinja2
pynacl
```

Most interesting Sprout modules for the executor templating are

```
app.services.templating
app.services.git
```

# Example executor templates

Working example executor templates can be found from [Template taking input and providing output](https://github.com/EfiPlutoTest/pluto-test-templates/tree/main/test_templates/inputs_n_outputs)
Example skeleton of yet to be Jira project creation template [Jira project creation template](projects/atlassian/jira)

# Executor template meta data
As with all other templates the executor template needs to define the `template.json` meta data file.
There is couple minor changes compared to the other template meta data files.

- The executor template meta data must define appType 'executable'
  - `"appType": "executable"`
- The executor template must define field 'executable' with name of the executable template script
  - e.g. `"executable": "create_jira_project.py"`
- The inputs that are desired to be passed to the executable template script as environment variables must define target
field value `executor`
  - `"target": "executor"`

Example of working executor template meta data file can be found from [Executor template meta data file](projects/atlassian/jira/template.json)

# Accessing executor template inputs
The executor template scripts execute inside a restricted environment that defines the inputs for the template script in
environment variables. The following environment variables are always available

```
PYTHONPATH
LD_LIBRARY_PATH
PATH
DEBUG
RESULT_FILE
```

Python path has been defined in a way that the Python 3 template script can access all the library code mentioned
earlier, the Sprout source code and the template script code. Nothing prevents the Python 3 template script to be 
implemented as full Python 3 application with modules and classes. The python 3 template script must have a command line
interface that accepts all the input only as environment variables.

LD_LIBRARY_PATH contains the binary library folders accessible in the AWS Lambda (Amazon Linux 2) environment.

PATH is set up the same way as it is in the AWS Lambda (Amazon Linux 2) environment.

DEBUG defines if the executor (and therefore the template script itself) is run in DEBUG mode. Possible values are
'True' and 'False'

RESULT_FILE defines absolute path to a file that the template script may write as the template execution result. The
file contents are not restricted in any other way than it must be in valid json format. The actual file name produced
by using that environment variable is the `executable_name.result.json` e.g. `create_jira_project.py.result.json`.
By using the value from the environment variable to create the result file enables the Sprout to be able to know that
it should read the contents from that result file and parse it as a JSON file.

# Executor template permissions
The executor template is able to read and write to the execution environment filesystem. Writing files is possible only
under the path /tmp. The executor script (and the working dorectory of it) itself is located under a temporary
subdirectory under the /tmp that will get removed after the script finishes. It is not advisable however to write any
files outside the script working directory.

The executor template may utilise [Python requests library](https://docs.python-requests.org/en/latest/) for accessing
http resources on the internet or of needed e.g. the Python socket module for low level TCP/IP traffic.

If access to protected customer resources are needed from the Sprout it may require setting up a customer specific
Sprout instance and/or allowing traffic from the Sprout to the systems on the customer side.

# Executor template credentials to external systems
When the executor template wants to access external systems (e.g. Jira) it needs credentials for those systems.
At the moment of writing this the only way to input those credentials for the executor templates is to define the
credentials as inputs for the template in the `template.json` file (using `password` input type)

In the future the Sprout will provide a way to define organisation specific secrets that can be injected as an input
for the executor templates in a way that the user does not need to have access to/know the actual credentials.

More information about defining the template input fields can be found from [Defining inputs for the templates](README.md#defining-inputs-for-the-templates)


