import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time

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
        driver.get("https://dexscreener.com/?rankBy=pairAge&order=asc")
        
        # Wait for the page to load
        time.sleep(3)

        # Find all elements with the specified class
        elements = driver.find_elements(By.XPATH, "//a[contains(@class, 'ds-dex-table-row-new')]")

        # Get href values from the elements
        hrefs = [element.get_attribute("href") for element in elements]
       

        for href in hrefs:
            driver.get(href)
            time.sleep(2)  # Add a delay to wait for the page to load

        # Close the browser
        driver.quit()
        # Close the browser
        return hrefs
        driver.quit()


    def save_to_json(self, pairs):
        with open('crypto.json', 'w') as file:
            json.dump(pairs, file, indent=4)
        print("Pairs saved to 'crypto.json'.")

    def cryptoScreen(self, tokenAddress):
        url = 'https://api.dexscreener.com/latest/dex/tokens/' + tokenAddress 
        getData = requests.get(url)
        if getData.status_code == 200:
            print(f"Status Code: {getData.status_code}, Content: {getData.json()}")
        else:
            print(f"Error handling request {getData.status_code}")


# Instantiate Main class
main = Main()

# Scrape dexscreener website for pairs
main.scrape_dexscreener()
