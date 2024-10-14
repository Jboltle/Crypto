const fs = require("fs");
const web3 = require("@solana/web3.js");
const dotenv = require("dotenv")

const getNewtokens = async () => {
  const url = "https://api.dexscreener.com/token-profiles/latest/v1";
  const response = await fetch(url);
  const data = await response.json();

  // Save data to file
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

  // Read the saved JSON file
  const cryptoData = fs.readFileSync("./data.json", "utf8");
  const tokenData = JSON.parse(cryptoData);

  // Create an empty array to store wallet addresses
  const tokens = [];

  // Loop through each item in the tokenData
  for (let i of tokenData) {
    // Check if the chainId is 'solana' and push the tokenAddress if true

        
        if (i.chainId ==='solana' && i.description.length >= 50){
      tokens.push(i.tokenAddress);
      
      console.table([{
        chainId: i.chainId,
        linksLength: i.links.length,
        descriptionLength: i.description.length,
        tokenAddress: i.tokenAddress
      }]);    }
  }
  await delay(10000)

  // Log the collected wallet addresses
  return tokens; // Ensure tokens are returned after the loop

}
async function getTokenLargestAccounts(token) {
  const url = "https://chaotic-convincing-sunset.solana-mainnet.quiknode.pro/96db2bd8fe5a81f793c29bc79b598a5d9007ef4f"
  const solana = new web3.Connection(url);
  const largestAccounts = await solana.getTokenLargestAccounts(
    new web3.PublicKey(token)
  );

  return largestAccounts.value; // Return the largest accounts directly
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processTokenAccounts = async () => {
  const WhaleWallets = [];
  const tokens = await getNewtokens();
  console.log(tokens);

  for (const token of tokens) {
    const wallets = await getTokenLargestAccounts(token);

    WhaleWallets.push({ token, wallets });
    await delay(1000); // Adjust the delay as necessary
  }

  console.log(WhaleWallets);
  fs.writeFileSync("WhaleWallets.json", JSON.stringify(WhaleWallets, null, 2));
  return WhaleWallets;
};

processTokenAccounts();

// Main process to find wallets interacting with a specific token
 