import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import re

class Main:
    def scrape_dexscreener(self):
        profile_path = 'C:/Users/Jon/AppData/Local/BraveSoftware/Brave-Browser/User Data'
        driver_path = 'C:/Users/Jon/Desktop/Crypto/chromedriver-win64'  # Provide path to chromedriver executable
        options = webdriver.ChromeOptions()
        options.binary_location = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'
        options.add_argument('user-data-dir=' + profile_path)
        options.add_argument('executable_path=' + driver_path)  # Corrected placement of executable_path
        driver = webdriver.Chrome(options=options)
        
        # Open the webpage
        driver.get("https://dexscreener.com/new-pairs/5m?rankBy=trendingScoreM5&order=desc&minLiq=1000&maxAge=3")

        # Wait for the page to load
        time.sleep(3)

        # Check for Cloudflare security challenge
        
        # Find all elements with the specified class
        elements = driver.find_elements(By.XPATH, "//a[contains(@class, 'ds-dex-table-row-new')]")

        # List to store href links
        hrefs = []

        # Iterate over the elements to collect href links
        for i, element in enumerate(elements[:5]):
            href = element.get_attribute("href")
            hrefs.append(href)

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
        with open('crypto.json', 'a') as file:
            json.dump(cryptoUrlKey, file, indent=4)
     

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
                        
                else:
                    print(f"Error handling request {getData.status_code}")
                    return

            # Save crypto data to JSON file
            with open('crypto.json', 'a') as file:
                json.dump(crypto_data, file, indent=4)
                print("Crypto data saved to 'crypto.json'.")
   

# Instantiate Main class
main = Main()

main.scrape_dexscreener()
