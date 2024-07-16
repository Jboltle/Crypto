import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os
import asyncio

class Main:
    def scrape_dexscreener(self):
        profile_path = "/Users/jboltle/Library/Application Support/BraveSoftware/Default"
        driver_path = '~/Sandbox/CryptoProject/Crypto/chromedriver-mac-x64/chromedriver'  # Provide path to chromedriver executable
        options = webdriver.ChromeOptions()
        options.binary_location = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
        options.add_argument('user-data-dir=' + profile_path)
        options.add_argument('executable_path=' + driver_path)  # Corrected placement of executable_path
        driver = webdriver.Chrome(options=options)
        api_key = "3812ad75-f5b8-4bf7-96f8-86518d9afd34"
        def response(api_key):
            r = requests.get(f"https://mainnet.helius-rpc.com/?api-key={api_key}")
            print(r.status_code)
            print ("Data", r.json)
            return api_key
        response(api_key)


main = Main()

main.scrape_dexscreener()
