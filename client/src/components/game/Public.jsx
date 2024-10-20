import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import "./Public.css";

const Public = () => {
  const [games, setGames] = useState([
    {
      customId: "001",
      stakeAmount: 50,
      targetPushups: 20,
      status: "created",
      startTime: new Date().setHours(new Date().getHours() + 1), // 1 hour from now
      endTime: new Date().setHours(new Date().getHours() + 2), // 2 hours from now
    },
    {
      customId: "002",
      stakeAmount: 100,
      targetPushups: 30,
      status: "active", // This game is active
      startTime: new Date().setHours(new Date().getHours() - 1), // 1 hour ago
      endTime: new Date().setHours(new Date().getHours() + 1), // 1 hour from now
    },
    {
      customId: "003",
      stakeAmount: 75,
      targetPushups: 25,
      status: "ended",
      startTime: new Date().setHours(new Date().getHours() - 2), // 2 hours ago
      endTime: new Date().setHours(new Date().getHours() - 1), // 1 hour ago
    },
  ]);

  return (
    <div className="public-container">
      {games.map((game) => (
        <div
          key={game.customId}
          className={`public-game-card ${
            game.status === "active" ? "public-active" : ""
          }`}
        >
          <p className="public-gameID">Game {game.customId}</p>
          <div className="public-iconContainer">
            <img src={Logo} alt="Game Logo" className="public-logo" />
          </div>
          <p className="public-globalText">Stake Amount: ${game.stakeAmount}</p>
          <p className="public-pushups">Target Pushups: {game.targetPushups}</p>
          <p className="public-status">Status: {game.status}</p>
          <div className="public-timeContainer">
            <p className="public-startText">
              Starts: {new Date(game.startTime).toLocaleTimeString("en-US")}
            </p>
            <p className="public-startText">
              Ends: {new Date(game.endTime).toLocaleTimeString("en-US")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Public;
