import { io } from "socket.io-client";
import axios from "axios";
import {
  FaGamepad,
  FaCheckCircle,
  FaRedo,
  FaBell,
  FaTimes,
} from "react-icons/fa";

const socket = io("https://10.77.0.149:8000");

export const initializeSocketListeners = (
  setNotification,
  setProgress,
  setIcon,
  setGameStatus,
  showNotification // Add this parameter
) => {
  socket.on("gameCreated", () => {
    showNotification(
      "A new game has been created!",
      <FaGamepad />,
      setNotification,
      setProgress,
      setIcon
    );
    setGameStatus("created"); // Set game status to 'created'
  });

  socket.on("gameActivated", () => {
    showNotification(
      "A game has been activated!",
      <FaCheckCircle />,
      setNotification,
      setProgress,
      setIcon
    );
    setGameStatus("activated"); // Set game status to 'activated'
  });

  socket.on("gameStarted", () => {
    showNotification(
      "A game has started!",
      <FaBell />,
      setNotification,
      setProgress,
      setIcon
    );
    setGameStatus("active"); // Set game status to 'active'
  });

  socket.on("gameReset", () => {
    showNotification(
      "The game has been reset.",
      <FaRedo />,
      setNotification,
      setProgress,
      setIcon
    );
    setGameStatus("reset"); // Set game status to 'reset' if needed
  });

  socket.on("gameEnded", () => {
    showNotification(
      "The game has ended.",
      <FaCheckCircle />,
      setNotification,
      setProgress,
      setIcon
    );
    setGameStatus("ended"); // Set game status to 'ended'
  });
};

// Updated joinGame function to return error message if any
export const joinGame = async (userId, stakeAmount, showNotification) => {
  try {
    const response = await axios.post(
      "https://10.77.0.149:8000/game/joinGame",
      {
        userId,
        stake: stakeAmount,
      }
    );

    if (response.status === 200) {
      showNotification(
        "You have successfully joined the game!",
        <FaCheckCircle />
      );
      return ""; // No error
    }
  } catch (error) {
    console.error("Error joining the game:", error);
    showNotification("Failed to join the game. Please try again.", <FaTimes />);
    return (
      error.response?.data?.message ||
      "Failed to join the game. Please try again."
    );
  }
};
export const submitResponse = async (
  userId,
  videoSubmitted,
  showNotification
) => {
  try {
    console.log(`Submiting video ${videoSubmitted} from ${userId}`);
    const response = await axios.post(
      "https://10.71.4.16:8000/game/submitResponse",
      {
        userId,
        videoSubmitted,
      }
    );

    if (response.status === 200) {
      showNotification("Response submitted successfully!", <FaCheckCircle />);
      return ""; // No error
    }
  } catch (error) {
    console.error("Error submitting response:", error);
    return (
      error.response?.data?.message ||
      "Failed to submit response. Please try again."
    );
  }
};

export const showNotification = (
  message,
  iconComponent,
  setNotification,
  setProgress,
  setIcon
) => {
  setNotification(message);
  setIcon(iconComponent);
  setProgress(0);
  const progressInterval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        clearInterval(progressInterval);
        setNotification("");
        return 100;
      }
      return prev + 1;
    });
  }, 40); // Adjust this interval for different speeds
};
