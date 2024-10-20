import React, { useState } from "react";
import axios from "axios"; // Import axios
import { getWinners, payoutWinners, returnBets } from "../utils/SmartContract";
import ChainInfo from "../utils/chains.json";

const AdminPage = () => {
  const [message, setMessage] = useState("");
  const [gameId, setGameId] = useState(""); // For "end game" command
  const [latestGame, setLatestGame] = useState(null); // State to hold latest past game data

  // Function to handle API requests using axios
  const sendCommand = async (command) => {
    let endpoint = `https://10.77.0.149:8000/admin/${command}`; // Update the endpoint to match the backend
    let body = {};

    if (command === "end") {
      // For "end" game, we need to pass the game ID
      body = { gameId };
    }

    try {
      const response = await axios.post(endpoint, body);
      setMessage(
        `${command} command successful: ${JSON.stringify(response.data)}`
      );
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Error response from the server
        setMessage(`Error running ${command}: ${error.response.data.message}`);
      } else {
        // General error
        setMessage(`An error occurred with the ${command} command.`);
      }
    }
  };

  // Function to fetch the latest past game
  const fetchLatestPastGame = async () => {
    try {
      const response = await axios.get("https://10.77.0.149:8000/game/result"); // Adjust the endpoint as needed
      const gameData = response.data.game; // Use game data directly from the response

      setLatestGame(gameData); // Update the state for UI purposes
      setMessage("Latest past game data fetched successfully.");

      try {
        console.log("Attempting to return bets");
        await returnBets(ChainInfo["Skale Nebula"].gameCA, gameData.winner);
      } catch (error) {
        console.error("Failed to return bets: ", error);
      }

      try {
        console.log("Attempting to fetch winners");
        const luckyWinners = await getWinners(
          ChainInfo["Skale Nebula"].gameCA,
          gameData.winner
        );
        console.log("Attempting to payout winners");

        await payoutWinners(ChainInfo["Skale Nebula"].gameCA, luckyWinners);
      } catch (error) {
        console.error("Failed to prize winners: ", error);
      }
    } catch (error) {
      console.error("Error fetching latest past game:", error);
      setMessage("Failed to fetch latest past game.");
    }
  };

  return (
    <div>
      <h1>Game Admin Panel</h1>
      <button onClick={() => sendCommand("create")}>Create Game</button>
      <button onClick={() => sendCommand("activate")}>Activate Game</button>
      <button onClick={() => sendCommand("start")}>Start Game</button>
      <button onClick={() => sendCommand("reset")}>Reset Game</button>

      {/* End Game requires game ID */}
      <input
        type="text"
        placeholder="Enter Game ID to end"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
      <button onClick={() => sendCommand("end")}>End Game</button>

      {/* Button to fetch the latest past game */}
      <button onClick={fetchLatestPastGame}>Show Latest Past Game</button>

      {/* Display response message */}
      {message && <p>{message}</p>}

      {/* Display the latest past game data if available */}
      {latestGame && (
        <div className="game-details">
          <h2>Latest Past Game</h2>
          <p>
            <strong>Target Pushups:</strong> {latestGame.targetPushups}
          </p>
          <p>
            <strong>Stake Amount:</strong> ${latestGame.stakeAmount}
          </p>
          <p>
            <strong>Players:</strong>{" "}
            {latestGame.players
              .map((player) => player.walletAddress)
              .join(", ")}
          </p>
          <p>
            <strong>Winners:</strong> {latestGame.winner.join(", ")}
          </p>
          <p>
            <strong>Losers Pool:</strong> {latestGame.losersPool.join(", ")}
          </p>
          <p>
            <strong>Responses:</strong>
          </p>
          <ul>
            {latestGame.responses.map((response, index) => (
              <li key={index}>
                {response.walletAddress}: {response.response}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
