*** Settings ***

Resource   ${CURDIR}/variables.robot

Library     SeleniumLibrary  timeout=15

Variables   ./variables.py
Library     ../libs/library.py

Documentation   Test suite should always import only one resource file.
...  Thus, ideally your resource files create a tree structure while
...  importing. This resource file should be the common root for them all where
...  project-wide keywords, imports, and other settings reside.

*** Keywords ***

Open browser and go to homepage
  Open Browser to    ${SERVER}

Open Browser to  [Arguments]  ${location}
  Run Keyword If      '${BROWSER}' == 'HeadlessChrome'      Open Headless Chrome Browser to    ${location}
  ...     ELSE IF     '${BROWSER}' == 'HeadlessFirefox'     Open Headless Firefox Browser to    ${location}
  ...     ELSE        Open Graphical Browser to    ${location}

Open Headless Chrome Browser to  [Arguments]  ${location}
  ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys
  Call Method    ${chrome_options}    add_argument    --disable-gpu
  Call Method    ${chrome_options}    add_argument    --disable-extensions
  Call Method    ${chrome_options}    add_argument    --headless
  Call Method    ${chrome_options}    add_argument    --no-sandbox
  Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
  Create Webdriver    Chrome    chrome_options=${chrome_options}
  Set Window Size    1920    1080
  Go To    ${location}

Open Headless Firefox Browser to  [Arguments]  ${location}
  ${firefox options} =     Evaluate    sys.modules['selenium.webdriver'].firefox.webdriver.Options()    sys, selenium.webdriver
  Call Method    ${firefox options}   add_argument    -headless
  Create Webdriver    Firefox    firefox_options=${firefox options}
  Set Window Size    1920    1080
  Go To    ${location}

Open Graphical Browser to  [Arguments]  ${location}
  Open Browser    ${location}    ${BROWSER}
  Maximize Browser Window

Go To Login
  Go To     ${SERVER}/login

Logout and close browser
  Logout
  Close Browser

Verify login page is open
  Wait Until Element is Enabled    name:email
  Location should be          ${SERVER}/login

Verify homepage is open
  Wait Until Page Contains    Hello
  Location should be          ${SERVER}/

Login
  [Arguments]    ${email}    ${password}
  Input Text                  name=email         ${email}
  Input Text                  name=password      ${password}
  Submit Form

Logout
  Run Keyword And Ignore Error    Go To    ${SERVER}/logout

Click Button With Span  [Arguments]  ${locator}
  Click Button  //button[contains(text(), '${locator}')]

Verify language is suomi
  Wait Until Page Contains    Salasana

Verify language is English
  Wait Until Page Contains    Password

Change language to   [Arguments]    ${language}
  Click Element   //div[contains(concat(' ',normalize-space(@class),' '),'languageselect')]
  Click Element   //div[@id='language_${language}']
