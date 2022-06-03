#!/usr/bin/env python

import os
import json
import logging as log
# from utils.common import LogManager

if __name__ == '__main__':
  print("RUNNING....")
  # log.info("Environment: %s", os.environ)

  filename = "jenkins-multibranch-pipeline.xml"

  if not os.path.exists(filename):
    print("File does not exist.")
  else:
    print("File exists.")
    with open(filename, 'r', encoding="utf8") as file:
      content = file.read().splitlines()

    for line in content:
      print(line)
