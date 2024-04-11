import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
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

        print("Cloudflare cookie token found")
                    
        # Find all elements with the specified class
        elements = driver.find_elements(By.XPATH, "//a[contains(@class, 'ds-dex-table-row-new')]")

        # List to store href links
        hrefs = []

        # Iterate over the elements to collect href links
        for i, element in enumerate(elements[:10]):
            href = element.get_attribute("href")
            print(f"Found href {i + 1}: {href}")
            hrefs.append(href)

        # Iterate over the collected href links to open them
        for i, href in enumerate(hrefs):
            print(f"Opening href {i + 1}: {href}")
            driver.get(href)
            time.sleep(5)  # Add a delay to wait for the page to load

            try:
                # Find and click the "Copy" button if it exists
                copy_button = driver.find_element(By.XPATH, '//*[@title="Copy"]')
                copy_button.click()
                print("Clicked on the 'Copy' button")
                time.sleep(3)  # Wait for the copy action to complete

                # Get the copied pair
                copied_pair = driver.execute_script("return navigator.clipboard.readText();")
                print("Copied pair:", copied_pair)

                # Add the copied pair to the list
                pairs = []
                pairs.append(copied_pair)
            except NoSuchElementException:
                print("No 'Copy' button found on this page")

        # Close the browser
        driver.quit()

        # Save pairs to JSON file
        self.save_to_json(pairs)

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

# Scrape dexscreener website for pairs and save them to JSON file
main.scrape_dexscreener()
