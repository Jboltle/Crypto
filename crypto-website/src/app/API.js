const { Connection, PublicKey } = require("@solana/web3.js");
const axios = require("axios");

const apiRequest = async (keysValue) => {
  const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
  const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
  let credits = 0;
console.log(keysValue)
  const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
  // Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
  const connection = new Connection(`https://chaotic-convincing-sunset.solana-mainnet.quiknode.pro/${keysValue.api}`, {
    wsEndpoint: `wss://chaotic-convincing-sunset.solana-mainnet.quiknode.pro/${keysValue.websocket}`,
    httpHeaders: { "x-session-hash": SESSION_HASH }
  });


  // Monitor logs
  const main = async (connection, programAddress) => {
    console.log("Monitoring logs for program:", programAddress.toString());

    // Adding searching animation


    connection.onLogs(
      programAddress,
      ({ logs, err, signature }) => {
        if (err) return;

        if (logs && logs.some(log => log.includes("initialize2"))) {
          console.log("\nSignature for 'initialize2':", signature);
          fetchRaydiumAccounts(signature, connection)
        }
      },
      "finalized"
    );
  };

  // Parse transaction and filter data
  async function fetchRaydiumAccounts(txId, connection) {
    const tx = await connection.getParsedTransaction(
      txId,
      {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed'
      });

    credits += 100;

    const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;
    console.log(accounts);
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

    const displayDataOnPage = () => {
      const tokenAAccount = accounts[tokenAIndex];
      let array = [];
      array.push(tokenAAccount);

      for (i in array) {
        if (tokenAAccount.contains("")) {
          return (
            <div>
              <p>
                `${tokenAAccount.toBase58()}`
              </p>
            </div>
          );
        }
      }
    };
    displayDataOnPage();

    console.log("New LP Found");
    console.log(generateExplorerUrl(txId));
    console.table(displayData);
    fs.writeFileSync("solscanData.json", JSON.stringify(tokenAAccount, null, 2));

    async function dexScreenerAPI(tokenAAccount) {
      const tokenAAccountBase58 = tokenAAccount.toBase58();
      const apiURL = `https://api.dexscreener.com/latest/dex/tokens/${tokenAAccountBase58}`;
      try {
        const response = await axios.get(apiURL);
        console.log('dexScreenerData.json', JSON.stringify(response.data));
      } catch (error) {
        console.log("Error occurred:", error);
      }
    }

    dexScreenerAPI(tokenAAccount);

    console.log("Total QuickNode Credits Used in this session:", credits);

    // Write data to solscanData.json
    const solscanData = {
      transactionId: txId,
      tokenAAccount: tokenAAccount.toBase58(),
      tokenBAccount: tokenBAccount.toBase58()
    };

    function generateExplorerUrl(txId) {
      return `https://solscan.io/tx/${txId}`;
    }
  }

  main(connection, raydium).catch(console.error);
};

export { apiRequest };

