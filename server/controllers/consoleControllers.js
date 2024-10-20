const mongoose = require("mongoose");
const readline = require("readline");
const express = require("express");

const router = express.Router();
const Game = require("../models/Game");
const User = require("../models/User");
const PastGame = require("../models/pastGames");

module.exports = (io) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter a command (create, activate, start, reset, kill): ",
  });

  const gameConsole = () => {
    rl.prompt();

    rl.on("line", async (line) => {
      const [command, ...args] = line.trim().split(" ");

      switch (command) {
        case "create":
          await createGame();
          break;
        case "activate":
          await activateGame();
          break;
        case "start":
          await startGame();
          break;
        case "reset":
          await resetGame();
          break;
        default:
          console.log(
            "Unknown command. Use: create, activate, start, reset, kill."
          );
      }

      rl.prompt();
    });
  };

  const createGame = async () => {
    await Game.deleteMany({});
    console.log("Deleted older games.");

    const newGame = new Game({
      customId: Date.now(),
      targetPushups: 10,
      stakeAmount: Math.floor(Math.random() * 10) + 1,
      status: "inactive",
      gameStarted: false,
      gameEnded: false,
    });

    await newGame.save();
    console.log("Game created successfully:", newGame);
    io.emit("gameCreated", newGame);
  };

  const activateGame = async () => {
    const game = await Game.findOne({ status: "inactive" });
    if (!game) return console.log("No game to activate.");

    game.status = "active";
    await game.save();
    console.log("Game activated:", game);
    io.emit("gameActivated", game);
  };

  const startGame = async () => {
    const game = await Game.findOne({ status: "active", gameStarted: false });
    if (!game) return console.log("No active game to start.");

    game.gameStarted = true;
    await game.save();
    console.log("Game started:", game);
    io.emit("gameStarted", game);

    setTimeout(() => {
      console.log("Ending game automatically...");
      endGame(game._id);
    }, 60 * 1000); // End the game after 10 minutes
  };

  const resetGame = async () => {
    const game = await Game.findOne({ gameStarted: true });
    if (!game) return console.log("No game to reset.");

    game.status = "inactive";
    game.gameStarted = false;
    game.players = [];
    game.responses = [];
    await game.save();

    console.log("Game reset:", game);
    io.emit("gameReset", game);
  };

  const endGame = async (gameId) => {
    const game = await Game.findById(gameId).populate("players");
    if (!game) return console.log("No game found to end.");

    // Filter winners and losers based on responses
    const winners = game.responses.filter((entry) => entry.response === "yes");
    const losers = game.responses.filter((entry) => entry.response === "no");

    // Make sure all responses have valid wallet addresses
    game.responses = game.responses.map((response) => {
      if (!response.walletAddress) {
        console.log("Invalid response without walletAddress:", response);
        // Handle the case where walletAddress is missing (ignore or set default)
        response.walletAddress = "unknown_wallet_address"; // Set fallback or log error
      }
      return response;
    });

    // Store losers' wallet addresses in losersPool
    game.losersPool = losers.map((loser) => loser.walletAddress);

    const poolAmount = game.stakeAmount * game.losersPool.length;
    const rewardAmount = (poolAmount * 0.7) / winners.length;

    // Update the winners' funds
    for (const winner of winners) {
      const user = await User.findOne({ walletAddress: winner.walletAddress });
      if (user) {
        user.funds += rewardAmount;
        await user.save();
      }
    }

    // Update the losers' losses
    for (const loser of losers) {
      const user = await User.findOne({ walletAddress: loser.walletAddress });
      if (user) {
        user.losses.push(game.stakeAmount);
        await user.save();
      }
    }

    // Create and save past game data
    const pastGame = new PastGame({
      players: game.players, // Players with wallet addresses and stake amounts
      targetPushups: game.targetPushups,
      stakeAmount: game.stakeAmount,
      losersPool: game.losersPool, // Wallet addresses of losers
      winner: winners.map((winner) => winner.walletAddress), // Wallet addresses of winners
      responses: game.responses, // Store responses with wallet addresses
    });

    await pastGame.save();
    console.log("Game ended:", pastGame);

    // Reset the game
    game.status = "inactive";
    game.gameStarted = false;
    game.players = [];
    game.responses = [];
    await game.save();

    // Emit a socket event
    io.emit("gameEnded", game);
  };

  // Start the console on load
  gameConsole();

  // Express.js Routes
  router.post("/create", async (req, res) => {
    await createGame();
    res.status(200).send("Game created");
  });

  router.post("/activate", async (req, res) => {
    await activateGame();
    res.status(200).send("Game activated");
  });

  router.post("/start", async (req, res) => {
    await startGame();
    res.status(200).send("Game started");
  });

  router.post("/reset", async (req, res) => {
    await resetGame();
    res.status(200).send("Game reset");
  });

  return router; // Make sure to return the router
};
