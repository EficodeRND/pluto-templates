from selenium import webdriver
from robot.libraries.BuiltIn import BuiltIn
from robot.api import logger

def Get_And_Clear_Browser_Log():
    selib = BuiltIn().get_library_instance('SeleniumLibrary')._current_browser()
    
    browser = selib.capabilities['browserName']
    if browser == "chrome":
        logs = selib.get_log('browser')
    else:
        logs = ""
        logger.info("Using unsupported browser {}. Not able to parse logs".format(browser))

    logString = "\n".join([log["message"] for log in logs])

    return logString
