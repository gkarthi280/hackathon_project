const express = require("express");
const {
  getAllGames,
  joinGame,
  submitResponse,
  getUserResult,
  getLatestPastGame,
} = require("../controllers/gameController");
const router = express.Router();

// Route to get all scheduled games
router.get("/", getAllGames);

// Route to allow a user to join the current game
router.post("/joinGame", joinGame);

// Route for a user to submit their response during an active game
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/submitResponse", upload.single("video"), submitResponse);

router.get("/", getLatestPastGame);

module.exports = router;
