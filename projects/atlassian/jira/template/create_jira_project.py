#!/usr/bin/env python

import os
import json
import logging as log
from utils.common import LogManager
from some_utility import tech_util

if __name__ == '__main__':
    log_manager = LogManager()
    log_manager.init_logging()
    log.info("Creating Jira project...")

    log.info("Environment: %s", os.environ)

# Levels:
# CRITICAL
# INFO
# DEBUG

    result = {
        'projectKey': {'value': 'TSTPRJ',
                       'description': 'Jira project key',
                       'level': 'INFO'},

        'projectName': {'value': os.environ['PROJECT_NAME'],
                        'description': 'Project name',
                        'level': 'INFO'},
        'boardType': {'value': os.environ['BOARD_TYPE'],
                      'description': '',
                      'level': 'INFO'},
        'url': {'value': 'http://jira.yourcompany.example.com/TSTPRJ/Kanban',
                'description': 'Jira URL',
                'level': 'CRITICAL'},

        'someValue': {'value': tech_util.sum_n_multiply(2),
                      'description': 'Computed value',
                      'level': 'DEBUG'}
    }

    with open(os.environ['RESULT_FILE'], 'w', encoding="utf8") as target_file:
        target_file.write(json.dumps(result))

    log.info("...DONE")
