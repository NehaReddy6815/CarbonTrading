const StellarSdk = require("stellar-sdk");

const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

// Load account from secret key
const keypair = StellarSdk.Keypair.fromSecret(process.env.SECRET_KEY);

// 🔹 Create transaction
async function createTransaction(hash) {
  try {
    const account = await server.loadAccount(keypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: keypair.publicKey(), // self transfer
          asset: StellarSdk.Asset.native(),
          amount: "0.00001",
        })
      )
      // Store first 28 chars (TEXT memo limit)
      .addMemo(StellarSdk.Memo.text(hash.substring(0, 28)))
      .setTimeout(30)
      .build();

    // Sign transaction
    transaction.sign(keypair);

    // Submit
    const result = await server.submitTransaction(transaction);

    return result.hash; // transaction ID

  } catch (error) {
    console.error("Stellar Transaction Error:", error.response?.data || error);
    throw error;
  }
}

// 🔹 Verify hash exists on chain
async function verifyHashOnChain(hash) {
  try {
    const publicKey = keypair.publicKey();

    const transactions = await server
      .transactions()
      .forAccount(publicKey)
      .limit(50)
      .order("desc")
      .call();

    for (let tx of transactions.records) {
      if (tx.memo && tx.memo === hash.substring(0, 28)) {
        return true;
      }
    }

    return false;

  } catch (error) {
    console.error("Verification Error:", error.response?.data || error);
    throw error;
  }
}

module.exports = {
  createTransaction,
  verifyHashOnChain,
};