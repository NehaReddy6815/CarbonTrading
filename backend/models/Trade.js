const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  buyer: { type: String, required: true },
  seller: { type: String, required: true },
  credits: { type: Number, required: true },
  hash: { type: String, required: true },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trade", tradeSchema);