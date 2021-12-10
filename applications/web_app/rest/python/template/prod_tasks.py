from invoke import run, task
from tasks import SRC_PATH, install


@task(pre=[install])
def prodserver(context, port=8080, daemon=False, unbuffered=True):
    daemon = ' --daemon' if daemon else ''
    un_buffer: str = 'TRUE' if unbuffered is True else 'FALSE'

    host = '0.0.0.0'
    daemon = daemon
    workers = '5'
    timeout = '3600'
    app = 'rest_api:app'

    cmd = f"gunicorn --bind {host}:{port}{daemon} --worker-class eventlet --workers {workers} --timeout {timeout} {app}"
    run(cmd, env={'PYTHONPATH': SRC_PATH, 'PYTHONUNBUFFERED': un_buffer})
