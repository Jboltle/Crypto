const fs = require('fs');
const web3 = require ('@solana/web3.js')

const getNewtokens = async () => {
  const url = "https://api.dexscreener.com/token-profiles/latest/v1";
  const response = await fetch(url);
  const data = await response.json();
  
  // Save data to file
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  // Read the saved JSON file
  const cryptoData = fs.readFileSync('./data.json', 'utf8');
  const tokenData = JSON.parse(cryptoData);

  // Create an empty array to store wallet addresses
  const tokens = [];

  // Loop through each item in the walletdata
  for (let i of tokenData) {
    // Check if the chainId is 'solana' and push the tokenAddress if true
    if (i.chainId === 'solana') {
      tokens.push(i.tokenAddress);
    }
    
    // Log the collected wallet addresses
    return tokens
};



}




async function getTokenLargestAccounts(token) {
    const url = "https://chaotic-convincing-sunset.solana-mainnet.quiknode.pro/96db2bd8fe5a81f793c29bc79b598a5d9007ef4f/";
    const solana = new web3.Connection(url);
    const largestAccounts = await solana.getTokenLargestAccounts(new web3.PublicKey(token));



    const result = await response.json();
    return result.result ? result.result.value && largestAccounts.value : "Cannot fetch Result" , [];
}




const processTokenAccounts = async () => {
const WhaleWallets = []
    const tokens = await getNewtokens()
    for (const token of tokens) {

        const wallets = await getTokenLargestAccounts(token)

        WhaleWallets.push({token , wallets})
    }
    console.log(WhaleWallets)

    return WhaleWallets
}



processTokenAccounts()



// Function to get transaction signatures for a given wallet address
async function getTransactionSignatures(walletAddress, limit = 10) {
    const headers = { "Content-Type": "application/json" };
    const data = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getConfirmedSignaturesForAddress2",
        "params": [
            walletAddress,
            { "limit": limit }
        ]
    };

    const response = await fetch(RPC_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });

    const result = await response.json();
    return result.result ? result.result : [];
}

// Function to get transaction details for a given transaction signature
async function getTransactionDetails(txSignature) {
    const headers = { "Content-Type": "application/json" };
    const data = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [txSignature, { "commitment": "confirmed" }]
    };

    const response = await fetch(RPC_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });

    const result = await response.json();
    return result.result ? result.result : null;
}

// Function to extract wallets involved in token transfers
function extractWalletsFromTransaction(transaction) {
    if (!transaction) return [];

    const wallets = [];
    const message = transaction.transaction.message;
    const instructions = message.instructions;

    instructions.forEach((instruction) => {
        if (instruction.parsed) {
            const info = instruction.parsed.info;
            if (info.source && info.destination) {
                wallets.push(info.source);
                wallets.push(info.destination);
            }
        }
    });

    return wallets;
}

// Main process to find wallets interacting with a specific token
async function findTokenWallets(tokenMint) {
    try {
        const largestAccounts = await getTokenLargestAccounts(tokenMint);
        const allWallets = [];

        for (const account of largestAccounts) {
            const signatures = await getTransactionSignatures(account.address, 10);
            for (const signature of signatures) {
                const transaction = await getTransactionDetails(signature.signature);
                const wallets = extractWalletsFromTransaction(transaction);
                allWallets.push(...wallets);
            }
        }

        // Remove duplicates by converting to Set and back to array
        const uniqueWallets = [...new Set(allWallets)];
        console.log("Wallets involved with the token:", uniqueWallets);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Example usage: replace with the token mint address
// const tokenMint = "<TOKEN_MINT_ADDRESS>";
// findTokenWallets(tokenMint);




