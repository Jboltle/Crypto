const { Connection, PublicKey } = require("@solana/web3.js");
const axios = require('axios');
const fs = require("fs");
const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection = new Connection(`https://frequent-soft-thunder.solana-mainnet.quiknode.pro/f0fc862dbf5b61aa9b7be9aa0e046710c7b53c5b/`, {
    wsEndpoint: `wss://frequent-soft-thunder.solana-mainnet.quiknode.pro/f0fc862dbf5b61aa9b7be9aa0e046710c7b53c5b/`,
    httpHeaders: { "x-session-hash": SESSION_HASH }
});

// Monitor logs
const main = async (connection, programAddress) => {
    console.log("Monitoring logs for program:", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            if (err) {
                return;
            }

            if (logs && logs.some(log => log.includes("initialize2"))) {
                console.log("Signature for 'initialize2':", signature);
                fetchRaydiumAccounts(signature, connection);
            }
        },
        "finalized"
    );
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId, connection) {
    const tx = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });

    credits += 100;

    const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY)?.accounts;

    if (!accounts) {
        console.log("No accounts found in the transaction.");
        return;
    }

    const tokenAIndex = 8;
    const tokenBIndex = 9;

    const tokenAAccount = accounts[tokenAIndex];
    const tokenBAccount = accounts[tokenBIndex];

    const displayData = [
        { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
        { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
    ];
    console.log("New LP Found");
    console.log(generateExplorerUrl(txId));
    console.table(displayData);
    console.log("Total QuickNode Credits Used in this session:", credits);

    console.log("", accounts);
}

function generateExplorerUrl(txId) {
    axios.get('https://public-api.solscan.io/chaininfo/', {
        params: {
            method: "GET",
            responseType: "json",
            accept: 'application/json',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MjExNjM2ODU2NjksImVtYWlsIjoiZGF4YWJlNTU3OUB2YXNvbWx5LmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImlhdCI6MTcyMTE2MzY4NX0.yImY6F5FhtrV2e3u3-JI-h9O4lr1owUS82hFzPGuyWM'
        }
    })
    .then(response => {
        fs.writeFileSync("/solscanData.json", JSON.stringify(response.data));
        console.log("Data Written to /solscanData.json");
    }).catch((err) => {
        console.error("Error:", err);
    });
}

main(connection, raydium).catch(console.error);


/*const dexScreenerAPI = async (tokenAAccount)  => {

tokenAAccount = tokenAAccount.toBase58();
const tokens = [];
tokens.push(tokenAAccount);
console.log(tokenAAccount);

for (let token in tokens) {
const apiURL = `https://api.dexscreener.com/latest/dex/tokens/${tokenAAccount}`
    console.log("API TOKEN", tokenAAccount , apiURL)
await axios.get(apiURL)
.then(function (response) {
    console.table([{"Response:": JSON.stringify(response)}, {"Request" : response.status}]);
})
.catch(function (error) {
    console.log(error);
})

}




}
*/