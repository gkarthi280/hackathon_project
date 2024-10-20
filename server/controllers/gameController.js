const mongoose = require("mongoose");
const Game = require("../models/Game");
const User = require("../models/User");
const PastGame = require("../models/pastGames");

// User joins a game
const joinGame = async (req, res) => {
  const { userId, stake } = req.body;
  console.log("Adding user:", userId);

  try {
    const game = await Game.findOne({ status: "inactive", gameStarted: false });
    if (!game) {
      console.log("No game available to join.");
      return res.status(404).json({ message: "No game available to join" });
    }

    const user = await User.findById(userId);
    if (!user || user.funds < stake) {
      console.log("Insufficient funds or user not found.");
      return res.status(400).json({ message: "Insufficient funds" });
    }
    if (user.activeGame === game._id) {
      console.log("User already in a game.");
      return res.status(400).json({ message: "User already in a game" });
    }

    // Deduct the stake from the user's funds
    user.funds -= stake;
    user.activeGame = game._id;

    // Add the user and their stake to the players array
    game.players.push({
      walletAddress: user.walletAddress, // Store wallet address as string
      stakeAmount: stake,
    });

    await user.save();
    await game.save();

    console.log(
      `User ${user.walletAddress} joined game ${game._id} with stake ${stake}`
    );

    // Emit a socket event for real-time updates
    req.io.emit("userJoined", {
      walletAddress: user.walletAddress,
      gameId: game._id,
    });

    res.status(200).json({
      message: `User ${user.walletAddress} joined game ${game._id} with stake ${stake}`,
    });
  } catch (error) {
    console.error("Error joining game:", error);
    res.status(500).json({ message: "Failed to join game", error });
  }
};

// User submits video response
// In gameController.js
const submitResponse = async (req, res) => {
  const { walletAddress } = req.body;
  const videoFile = req.file; // The uploaded video file is in req.file if Multer is being used

  if (!videoFile) {
    console.log("No video uploaded.");
    return res.status(400).json({ message: "No video uploaded" });
  }

  console.log("Submitting response for wallet:", walletAddress);

  try {
    const game = await Game.findOne({ status: "active", gameStarted: true });
    if (!game) {
      console.log("No active game found.");
      return res.status(404).json({ message: "No active game found" });
    }

    if (!walletAddress) {
      return res.status(400).json({ message: "walletAddress is required" });
    }

    const response = videoFile ? "yes" : "no"; // Adjust response based on the video file being uploaded
    game.responses.push({ walletAddress, response });

    await game.save();

    console.log(
      `User with wallet ${walletAddress} submitted a ${response} response.`
    );

    req.io.emit("responseSubmitted", { walletAddress, response });

    res.status(200).json({ message: `Response submitted: ${response}` });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ message: "Failed to submit response", error });
  }
};

// Fetch all games
const getAllGames = async (req, res) => {
  console.log("Sending games");
  try {
    const games = await Game.find({}).sort({ startTime: 1 });
    if (!games || games.length === 0) {
      return res.status(201).json({ message: "No games found." });
    }
    res.status(200).json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "Failed to fetch games", error });
  }
};

const getUserResult = async (req, res) => {
  const { walletAddress } = req.params; // Assume walletAddress is passed as a parameter
  try {
    const game = await PastGame.findOne({
      "players.walletAddress": walletAddress,
    });
    if (!game) {
      console.log(
        `No past game found for user with wallet address ${walletAddress}`
      );
      return res.status(404).json({ message: "Game result not found" });
    }

    const result = game.winner.some((winner) => winner === walletAddress)
      ? "win"
      : "lose";
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching user result:", error);
    res.status(500).json({ message: "Failed to fetch result" });
  }
};

const getLatestPastGame = async (req, res) => {
  try {
    // Find the most recent past game, sorted by _id (which contains a timestamp)
    const game = await PastGame.findOne()
      .sort({ _id: -1 }) // Sort by _id in descending order to get the most recent game
      .exec();

    if (!game) {
      console.log(`No past games found.`);
      return res.status(404).json({ message: "No past games found" });
    }

    res.status(200).json({ game }); // Return the most recent game
  } catch (error) {
    console.error("Error fetching the latest past game:", error);
    res.status(500).json({ message: "Failed to fetch the latest past game" });
  }
};

module.exports = { getUserResult };

module.exports = {
  joinGame,
  submitResponse,
  getAllGames,
  getLatestPastGame,
};
