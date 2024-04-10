import requests

class  Main(): 
    
   tokenAddress = ''
    def mainFunc(self, tokenAddress) :
        url = 'https://api.dexscreener.com/latest/dex/tokens/' + tokenAddress 
        getData = requests.get(url)
        if getData.status_code == 200:
            print(f"Status Code: {getData.status_code}, Content: {getData.json()}")
        else:
            print(f"Error handling request {getData.status_code}")
            

main = Main()



