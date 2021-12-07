from os import path
from invoke import run, task

CURRENT_DIR = path.abspath(path.dirname(__file__))
SRC_PATH = CURRENT_DIR


@task
def install(context, package=None, skip_tests=False):
    run('pip install --upgrade pip')
    reqs = path.join(CURRENT_DIR, 'requirements.txt')
    if not skip_tests:
        test_requirements = path.join(CURRENT_DIR, 'requirements_test.txt')
        if path.exists(test_requirements):
            reqs = f"{reqs} -r {test_requirements}"

    cmd = f"pip install -r {reqs}"
    cmd = cmd.format(path.join(CURRENT_DIR, reqs))
    run(cmd)
    if package:
        run(f"pip install {package}")


@task
def devserver(context):
    run('./rest_api.py devserver', env={'PYTHONUNBUFFERED': 'TRUE'})
