const mongoose = require("mongoose");

const pastGameSchema = new mongoose.Schema({
  players: [
    {
      walletAddress: { type: String, required: true }, // Store wallet address
      stakeAmount: { type: Number, required: true },
    },
  ],
  targetPushups: { type: Number, required: true },
  stakeAmount: { type: Number, required: true },
  losersPool: [{ type: String }], // Store wallet addresses of losers
  winner: [{ type: String }], // Store wallet addresses of winners
  responses: [
    {
      walletAddress: { type: String, required: true }, // Use walletAddress
      response: { type: String, enum: ["yes", "no"], required: true },
    },
  ],
});

module.exports = mongoose.model("PastGame", pastGameSchema);
