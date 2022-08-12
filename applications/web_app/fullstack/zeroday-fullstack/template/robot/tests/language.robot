*** Settings ***

Resource   ${resourcesDirectory}/common.robot

Suite Setup          Open browser and go to homepage
Suite Teardown       Logout and close browser

*** Test cases ***

Language selection should work
  Go to Login
  Verify login page is open
  Change language to   fi
  Verify language is suomi
  Change language to   en
  Verify language is English
