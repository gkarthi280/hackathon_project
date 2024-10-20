import React, { useState } from "react";

const games = [
  {
    id: 1,
    name: "Game 1",
    image:
      "https://plus.unsplash.com/premium_photo-1677870728087-2257ce93bfe9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2FtZXxlbnwwfHwwfHx8MA%3D%3D",
    pool: "$500",
    stake: "$50",
    players: 10,
    startingIn: "10m",
  },
  {
    id: 2,
    name: "Game 2",
    image:
      "https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtZXxlbnwwfHwwfHx8MA%3D%3D",
    pool: "$1000",
    stake: "$100",
    players: 15,
    startingIn: "5m",
  },
  {
    id: 3,
    name: "Game 3",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bXVzY2xlfGVufDB8fDB8fHww",
    pool: "$250",
    stake: "$25",
    players: 8,
    startingIn: "20m",
  },
  // Add more games as needed
];

const Private = () => {
  const [hovered, setHovered] = useState(null);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "20px",
      minHeight: "100vh",
    },
    createButtonContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
    },
    createButton: {
      padding: "12px 25px",
      fontSize: "16px",
      fontWeight: "600",
      backgroundColor: "#ff9800",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background 0.3s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    createButtonHover: {
      backgroundColor: "#ffb74d",
    },
    gamesList: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      width: "100%",
      maxHeight: "70vh",
      overflowY: "auto",
      paddingBottom: "70px",
      scrollbarWidth: "none" /* Firefox */,
    },
    gameCard: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
      borderRadius: "12px",
      backgroundColor: "#333333",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    gameCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.5)",
    },
    gameImage: {
      width: "80px",
      height: "80px",
      borderRadius: "8px",
      marginRight: "15px",
      border: "2px solid #4caf50",
      objectFit: "cover",
    },
    gameInfo: {
      flex: 1,
      color: "#ffffff",
    },
    gameName: {
      fontSize: "20px",
      fontWeight: "bold",
      margin: 0,
      marginBottom: "5px",
    },
    gameDetail: {
      fontSize: "14px",
      margin: "3px 0",
      color: "#b0b0b0",
    },
    joinButton: {
      marginTop: "12px",
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      backgroundColor: "#3cbc48",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background 0.3s ease",
      boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
    },
    joinButtonHover: {
      backgroundColor: "#45d657",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.createButtonContainer}>
        <button
          style={{
            ...styles.createButton,
            ...(hovered === "create" ? styles.createButtonHover : {}),
          }}
          onMouseEnter={() => setHovered("create")}
          onMouseLeave={() => setHovered(null)}
        >
          Create Game
        </button>
      </div>
      <div style={styles.gamesList}>
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              ...styles.gameCard,
              ...(hovered === game.id ? styles.gameCardHover : {}),
            }}
            onMouseEnter={() => setHovered(game.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={game.image} alt={game.name} style={styles.gameImage} />
            <div style={styles.gameInfo}>
              <h3 style={styles.gameName}>{game.name}</h3>
              <p style={styles.gameDetail}>Total Pool: {game.pool}</p>
              <p style={styles.gameDetail}>Stake Amount: {game.stake}</p>
              <p style={styles.gameDetail}>Players: {game.players}</p>
              <p style={styles.gameDetail}>Starting in: {game.startingIn}</p>
              <button
                style={{
                  ...styles.joinButton,
                  ...(hovered === `join-${game.id}`
                    ? styles.joinButtonHover
                    : {}),
                }}
                onMouseEnter={() => setHovered(`join-${game.id}`)}
                onMouseLeave={() => setHovered(null)}
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Private;
