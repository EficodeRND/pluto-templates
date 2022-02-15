#!/usr/bin/env python

import sys
from flask import Flask
from utils.common import init_logging

init_logging()
app = Flask(__name__)


@app.route('/api')
def status():
    return 'Hello World!', 200


# No caching at all for API endpoints.
@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


def start_dev_server():
    app.run("0.0.0.0", port=8080, debug=True)


if __name__ == "__main__":
    if len(sys.argv) <= 1:
        print("Usage: collector.py [command]")
        print("Commands:")
        print("\tdevserver")
        print("\t\t run Flask server in debug mode")

    cmd = sys.argv[1]
    if cmd == "devserver":
        start_dev_server()
