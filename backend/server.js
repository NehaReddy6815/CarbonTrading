require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Trade = require("./models/Trade");
const connectDB = require("./db");
connectDB();

const { createTransaction, verifyHashOnChain } = require("./stellar");

const cors = require("cors");
app.use(cors());

const app = express();
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
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
    const txId = await createTransaction(hash);

    // 3. Save to MongoDB ✅
    const newTrade = new Trade({
      buyer,
      seller,
      credits,
      hash,
      transactionId: txId,
    });

    await newTrade.save();

    // 4. Send response
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

//history

app.get("/history", async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trades,
    });

  } catch (err) {
    console.error("History API Error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});