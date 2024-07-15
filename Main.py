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
        api_key = os.getenv("Helius_API_KEY")
        async def response():
            requests = requests.get("https://mainnet.helius-rpc.com/?api-key={api_key}")
            print ("Data", requests.text)
            return api_key
        response()



        # Open the webpage

        # Wait for the page 



            # Check fo  r Cloudflare security challenge

        # Find all elements with the specified class
        elements = driver.find_elements(By.XPATH, "//a[contains(@class, 'ds-dex-table-row-new')]")

        # List to store href links
        hrefs = []

        # Iterate over the elements to collect href links
        for i, element in enumerate(elements[:10]):
            href = element.get_attribute("href") 
            hrefs.append(href) # appends the href to the enumerated array list of hrefs

        # Iterate over the collected href links to open them
        pairs = []
        for i, href in enumerate(hrefs):
            print(f"Opening href {i + 1}: {href}")
            driver.get(href)
            time.sleep(3)  # Add a delay to wait for the page to load

            try:        
                # Get the copied pair
                url = driver.current_url
                cryptoUrlKey = url.split("/")[-1]
                # Add the copied pair to the list
                pairs.append(cryptoUrlKey)
            except IndexError:
                print("No Pair Key")
              
       
        
        
        driver.quit()

        # Call cryptoScreen method to get JSON data for each crypto URL and save to crypto.json
        self.cryptoScreen(pairs)

    def save_to_json(self, cryptoUrlKey):
        with open('/crypto.json', 'a') as file:
            json.dump(cryptoUrlKey, file, indent=4)
                                 
    def cryptoInformation(self,cryptoData):
       with open('cryptoWebsiteInformation', 'w') as cryptoInfo:
          json.dump(cryptoData,cryptoInfo, inden=4)
          
     

    def cryptoScreen(self, cryptoUrls):
            crypto_data = {}
            for cryptoUrl in cryptoUrls:
                url = 'https://api.dexscreener.com/latest/dex/pairs/solana/' + cryptoUrl
                getData = requests.get(url)
                if getData.status_code == 200:
                    pair_data = getData.json()
                    if 'info' in pair_data['pair']:
                        crypto_data[cryptoUrl] = pair_data
                    else:
                        print(f"Pair '{cryptoUrl}' has no 'info' key.")


# Instantiate Main class
main = Main()

main.scrape_dexscreener()
