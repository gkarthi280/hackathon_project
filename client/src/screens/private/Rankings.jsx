import React, { useState } from "react";
import Header from "../../components/Header";
import "./Rankings.css";

const topPlayers = [
  {
    rank: 1,
    name: "CharlieBEE",
    score: 1500,
    pushups: 500,
    earnings: "$1000",
    points: 1500,
    streak: 30,
    image:
      "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    rank: 2,
    name: "QueenK",
    score: 1350,
    pushups: 450,
    earnings: "$850",
    points: 1350,
    streak: 28,
    image:
      "https://plus.unsplash.com/premium_photo-1669138512601-e3f00b684edc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    rank: 3,
    name: "SallyDoe",
    score: 1200,
    pushups: 400,
    earnings: "$750",
    points: 1200,
    streak: 26,
    image:
      "https://plus.unsplash.com/premium_photo-1690407617686-d449aa2aad3c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const additionalStats = [
  {
    title: "Most Pushups",
    player: "DarthKing",
    value: "600",
    image:
      "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Most Earnings",
    player: "CharlieBEE",
    value: "$1200",
    image:
      "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Most Points",
    player: "CharlieBEE",
    value: "1700",
    image:
      "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Longest Streak",
    player: "Killer45",
    value: "35 Days",
    image:
      "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const Rankings = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="rankings-container">
      <div className="background">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <Header />
      <h1 className="rankings-title">Leaderboard</h1>

      <div className="top-players-section">
        {topPlayers.map((player) => (
          <div
            key={player.rank}
            className="top-player-card"
            onClick={() => setSelectedPlayer(player)}
          >
            <div className="rank-badge">{player.rank}</div>
            <img
              src={player.image}
              alt={player.name}
              className="player-avatar"
            />
            <div className="player-name">{player.name}</div>
            <div className="player-score">Score: {player.score}</div>
          </div>
        ))}
      </div>

      <h2 className="rankings-subtitle">Additional Stats</h2>
      <div className="additional-stats-section">
        {additionalStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <img src={stat.image} alt={stat.player} className="stat-avatar" />
            <div className="stat-info">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-player">{stat.player}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setSelectedPlayer(null)}
            >
              X
            </button>
            <img
              src={selectedPlayer.image}
              alt={selectedPlayer.name}
              className="modal-avatar"
            />
            <h3 className="modal-name">{selectedPlayer.name}</h3>
            <p className="modal-detail">Score: {selectedPlayer.score}</p>
            <p className="modal-detail">Pushups: {selectedPlayer.pushups}</p>
            <p className="modal-detail">Earnings: {selectedPlayer.earnings}</p>
            <p className="modal-detail">Points: {selectedPlayer.points}</p>
            <p className="modal-detail">Streak: {selectedPlayer.streak} Days</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rankings;
