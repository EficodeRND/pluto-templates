*** Settings ***

Resource   ${resourcesDirectory}/common.robot

Suite Setup          Open browser and go to homepage
Suite Teardown       Logout and close browser

*** Test cases ***

Should Succeed With Correct Credentials
  Go To Login
  Verify login page is open
  Login                 ${VALID EMAIL}    ${VALID PASSWORD}
  Verify homepage is open
  Logout
