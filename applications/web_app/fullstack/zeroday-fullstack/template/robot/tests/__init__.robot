*** Settings ***
Suite Setup   My Setup

*** Keywords ***
My Setup
  Set Global Variable  ${testsRootDirectory}  ${CURDIR}
  Set Global Variable  ${resourcesDirectory}  ${CURDIR}${/}..${/}resources
