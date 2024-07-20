import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";

const apiRequest = async (keysValue) => {
    const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
    const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
    let credits = 0;

    const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
    const connection = new Connection(`https://frequent-soft-thunder.solana-mainnet.quiknode.pro/${keysValue.api}`, {
        wsEndpoint: `wss://frequent-soft-thunder.solana-mainnet.quiknode.pro/${keysValue.websocket}`,
        httpHeaders: {"x-session-hash": SESSION_HASH}
    });

    console.log(connection.wsEndpoint);

    async function main(connection, programAddress) {
        console.log("Monitoring logs for program:", programAddress.toString());

        

        connection.onLogs(
            programAddress,
            ({ logs, err, signature }) => {
                if (err) return;

                if (logs && logs.some(log => log.includes("initialize2"))) {
                    console.log(" Signature for 'initialize2':", signature);
                    fetchRaydiumAccounts(signature, connection).then(() => searching = false);
                    return (
                        <p>
                            `${signature}`
                        </p>
    
                    )

                }
            },
            "finalized"
        );
    }

    async function fetchRaydiumAccounts(txId, connection) {
        const tx = await connection.getParsedTransaction(
            txId,
            {
                maxSupportedTransactionVersion: 0,
                commitment: 'confirmed'
            });

        credits += 100;

        const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;

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
        fs.writeFileSync("solscanData.json", JSON.stringify(tokenAAccount, null, 2));

        async function dexScreenerAPI(tokenAAccount) {
            const tokenAAccountBase58 = tokenAAccount.toBase58();
            const apiURL = `https://api.dexscreener.com/latest/dex/tokens/${tokenAAccountBase58}`;
            try {
                const response = await axios.get(apiURL)
                console.log('dexScreenerData.json', JSON.stringify(response.data));
                
            } catch (error) {
                console.log("Error occurred:", error);
            }
        }

        dexScreenerAPI(tokenAAccount)
        
        console.log("Total QuickNode Credits Used in this session:", credits);

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
}

export { apiRequest };
