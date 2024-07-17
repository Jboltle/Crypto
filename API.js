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
    console.log("Monitoring logs for program:", programAddress);
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





const dexScreenerAPI = async () => {
    const tokenA = tokenAAccount.toBase58();
    const tokenB = tokenBAccount.toBase58();
    const tokens = [tokenA, tokenB];

    for (const token of tokens) {
        const apiURL = `https://api.dexscreener.com/latest/dex/tokens/${token}`;
        console.log("API TOKEN", token, apiURL);
        await axios.get(apiURL)
            .then(function (response) {
                console.table([{ "Response:": JSON.stringify(response.data) }, { "Request Status": response.status }]);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
dexScreenerAPI();

}

function generateExplorerUrl(txId) {
   return(`https://solscan.io/tx/${txId}`)
}



main(connection, raydium).catch(console.error);