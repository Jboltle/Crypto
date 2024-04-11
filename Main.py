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
        driver.get("https://dexscreener.com/?rankBy=pairAge&order=asc&chainIds=solana&maxAge=6")

        # Wait for the page to load
        time.sleep(3)

        # Check for Cloudflare security challenge
        
                    
            # Find all elements with the specified class
        elements = driver.find_elements(By.XPATH, "//a[contains(@class, 'ds-dex-table-row-new')]")

        # List to store href links
        hrefs = []

        # Iterate over the elements to collect href links
        for i, element in enumerate(elements[:10]):
            href = element.get_attribute("href")
            hrefs.append(href)

        # Iterate over the collected href links to open them
        for i, href in enumerate(hrefs):
            print(f"Opening href {i + 1}: {href}")
            driver.get(href)
            time.sleep(3)  # Add a delay to wait for the page to load

            try:        
                # Get the copied pair
                url = driver.current_url
                cryptoUrlKey = url.split("/")[-1]
                print("PairKEY:", cryptoUrlKey)
                # Add the copied pair to the list
                pairs = []
                pairs.append(cryptoUrlKey)
                self.save_to_json(pairs)    
            except IndexError:
                print("No Pair Key")
        
        
        driver.quit()

        # Save pairs to JSON file

    def save_to_json(self, cryptoUrlKey):
        with open('crypto.json', 'w') as file:
            json.dump(cryptoUrlKey, file, indent=4)
        print('{cryptoUrlKey} saved to crypto.json')

    def cryptoScreen(self, cryptoUrlKey):
        url = 'https://api.dexscreener.com/latest/dex/pairs/solana/' + cryptoUrlKey
        getData = requests.get(url)
        if getData.status_code == 200:
            print(f"Status Code: {getData.status_code}, Content: {getData.json()}")
        else:
            print(f"Error handling request {getData.status_code}")


# Instantiate Main class
main = Main()

main.scrape_dexscreener()
