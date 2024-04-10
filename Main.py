import requests
import json
from telethon.sync import TelegramClient
import os
from dotenv import load_dotenv

class Main:
    
    def __init__(self):
        load_dotenv()
        self.telegram_api_key = os.getenv('telegram_api_key')
        self.telegram_api_hash = os.getenv('telegram_api_hash')
        self.phone_number = os.getenv('phone_number')
        self.channel_username = os.getenv('channel_username')
    
    def connectToChannel(self):
        client = TelegramClient('session_name', self.telegram_api_key, self.telegram_api_hash)
        client.connect()

        if not client.is_user_authorized():
            client.send_code_request(self.phone_number)
            client.sign_in(self.phone_number, input('Enter the code: '))

        # Get the channel entity
        channel_entity = client.get_entity(self.channel_username)

        # Retrieve messages from the channel
        messages = []
        for message in client.iter_messages(channel_entity):
            messages.append(message.to_dict())

        # Save messages to a JSON file
        with open('cryptoMessages.json', 'w') as file:
            json.dump(messages, file, indent=4)

        print("Messages retrieved and saved to 'channel_messages.json'")




    def cryptoScreen(self, tokenAddress):
        url = 'https://api.dexscreener.com/latest/dex/tokens/' + tokenAddress 
        getData = requests.get(url)
        if getData.status_code == 200:
            print(f"Status Code: {getData.status_code}, Content: {getData.json()}")
        else:
            print(f"Error handling request {getData.status_code}")


main = Main()
main.connectToChannel()

