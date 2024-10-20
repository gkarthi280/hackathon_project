const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  customId: { type: Number, required: true },
  targetPushups: { type: Number, required: true },
  stakeAmount: { type: Number, required: true },
  status: { type: String, enum: ["inactive", "active"], required: true },
  gameStarted: { type: Boolean, default: false },
  gameEnded: { type: Boolean, default: false },
  players: [
    {
      walletAddress: { type: String, required: true }, // Use walletAddress instead of ObjectId
      stakeAmount: { type: Number, required: true },
    },
  ],
  responses: [
    {
      walletAddress: { type: String }, // Use walletAddress instead of ObjectId
      response: { type: String, enum: ["yes", "no"] },
    },
  ],
});

module.exports = mongoose.model("Game", gameSchema);
