require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

// ❗ keep DB disabled for now
// const Trade = require("./models/Trade");
// const connectDB = require("./db");
// connectDB();

const { createTransaction, verifyHashOnChain } = require("./stellar");

const app = express();

app.use(cors());
app.use(express.json());

// ❗ In-memory storage (temporary instead of DB)
let tradeHistory = [];

// Health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

// 🔹 Generate SHA-256 hash
function generateHash(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

// 🔹 TRADE API
app.post("/trade", async (req, res) => {
  try {
    const { buyer, seller, credits } = req.body;

    // ✅ Validation
    if (!buyer || !seller || !credits) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const tradeData = { buyer, seller, credits };

    // 1. Generate hash
    const hash = generateHash(tradeData);

    // 2. Store on Stellar
    let txId;
    try {
      txId = await createTransaction(hash);
    } catch (err) {
      console.error("Stellar error:", err);
      return res.status(500).json({ error: "Stellar transaction failed" });
    }

    // ❗ DB disabled (optional)
    /*
    try {
      const newTrade = new Trade({
        buyer,
        seller,
        credits,
        hash,
        transactionId: txId,
      });

      await newTrade.save();
    } catch (dbError) {
      console.log("DB save skipped:", dbError.message);
    }
    */

    // ✅ STORE IN MEMORY
    tradeHistory.push({
      buyer,
      seller,
      credits,
      hash,
      transactionId: txId,
    });

    // 3. Send response
    res.json({
      success: true,
      hash,
      transactionId: txId,
    });

  } catch (err) {
    console.error("Trade API Error:", err);
    res.status(500).json({ error: "Transaction failed" });
  }
});

// 🔹 VERIFY API
app.post("/verify", async (req, res) => {
  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({ error: "Hash required" });
    }

    const exists = await verifyHashOnChain(hash);

    res.json({
      success: true,
      exists,
    });

  } catch (err) {
    console.error("Verify API Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// 🔹 HISTORY API
app.get("/history", (req, res) => {
  res.json({
    success: true,
    data: tradeHistory,
  });
});

// Start server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});