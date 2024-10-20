import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../utils/AuthProvider";
import "./Game.css";
import {
  initializeSocketListeners,
  joinGame,
  submitResponse,
} from "../../utils/gameFunctions";
import Logo from "../../assets/logo.png";
import { joinGameContract } from "../../utils/SmartContract";
import ChainInfo from "../../utils/chains.json";

const Game = () => {
  const { user } = useContext(AuthContext);
  const walletAddress = user?.walletAddress;
  const [notification, setNotification] = useState("");
  const [progress, setProgress] = useState(0);
  const [icon, setIcon] = useState(null);
  const [joinError, setJoinError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [gameStatus, setGameStatus] = useState("none");
  const [players, setPlayers] = useState([]);
  const [stake, setStake] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [userResult, setUserResult] = useState(null);
  const [hasJoinedGame, setHasJoinedGame] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const isUserInGame = players.includes(user?._id);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get("https://10.77.0.149:8000/game/");
        if (response.data.message === "No games found.") {
          setGameStatus("none");
        } else {
          const currentGame = response.data[0];
          setGameStatus(currentGame.status);
          setPlayers(currentGame.players || []);
          setHasJoinedGame(currentGame.players.includes(user?._id));
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGame();
    initializeSocketListeners(
      setNotification,
      setProgress,
      setIcon,
      setGameStatus,
      showNotification
    );
  }, []);

  const handleJoinGame = async () => {
    setLoading(true);
    if (!stake || isNaN(stake)) {
      showNotification("Please enter a valid stake amount.");
      return;
    }
    await joinGameContract(
      ChainInfo["Skale Nebula"].gameCA,
      ChainInfo["Skale Nebula"].usdcTokenCA,
      stake
    );

    const errorMessage = await joinGame(user._id, stake, showNotification);
    if (!errorMessage) {
      setPlayers((prevPlayers) => [...prevPlayers, user._id]);
      setStake("");
      setHasJoinedGame(true);
      setLoading(false);
    } else {
      setJoinError(errorMessage);
    }
  };

  const startCountdown = () => {
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (gameStatus === "active") {
      startCountdown();
    }
    if (gameStatus === "ended") {
      checkUserResult();
    }
  }, [gameStatus]);

  const checkUserResult = async () => {
    try {
      const response = await axios.get(
        `https://10.77.0.149:8000/game/result/${user._id}`
      );
      setUserResult(response.data.result);
    } catch (error) {
      console.error("Error fetching user result:", error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
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
    }, 40);

    setTimeout(() => {
      // Animate the notification disappearing
      const notificationBar = document.querySelector(".notification-bar");
      if (notificationBar) {
        notificationBar.style.animation = "fadeOut 0.5s forwards";
      }
      setTimeout(() => setNotification(""), 500); // Remove notification after fade
    }, 4000); // Delay to allow progress bar to fill
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      showNotification("getUserMedia not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const submitVideo = async () => {
    if (!videoBlob) return;

    const formData = new FormData();
    formData.append("video", videoBlob, "pushups.webm");
    formData.append("walletAddress", walletAddress); // Correct field name here

    try {
      const response = await axios.post(
        `https://10.77.0.149:8000/game/submitResponse`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showNotification("Video submitted successfully!");
      setVideoBlob(null); // Clear the video blob after submission
    } catch (error) {
      console.error("Error submitting video:", error);
      showNotification("Error submitting video.");
    }
  };

  return (
    <div className="game-container">
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {notification !== "" && (
        <div className="notification-bar">
          <div className="notification-content">
            <div className="notification-message">{notification}</div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <div className="header">
        <h1 className="title">Games</h1>
      </div>

      <div className="card">
        {gameStatus === "none" && (
          <p className="globalText">No upcoming games at the moment.</p>
        )}
        {gameStatus === "created" && (
          <p className="globalText">A new game has been created. Join now!</p>
        )}
        {gameStatus === "activated" && (
          <p className="globalText">
            {isUserInGame
              ? "The game is activated! Wait for the start."
              : "The game is activated, but you are not enrolled. Join now!"}
          </p>
        )}
        {gameStatus === "active" && (
          <p className="globalText">
            {isUserInGame
              ? "Game is in progress. Time left to do pushups!"
              : "The game is in progress, but you are not enrolled."}
          </p>
        )}
        {gameStatus === "ended" && (
          <p className="globalText">
            The game has ended. {userResult ? `You ${userResult}!` : ""}
          </p>
        )}

        {gameStatus !== "none" && (
          <p className="poolText">
            {gameStatus === "created"
              ? "Current Pool Size"
              : "Current Reward Pool"}{" "}
            <span className="poolAmount">$1,253,000</span>
          </p>
        )}

        <div className="iconContainer">
          <img src={Logo} alt="Game Logo" className="logo" />
        </div>

        {gameStatus === "created" && !hasJoinedGame ? (
          <div className="inputContainer">
            <input
              type="number"
              className="input"
              placeholder="Enter bet amount"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
            <button className="joinButton" onClick={handleJoinGame}>
              Stake
            </button>
          </div>
        ) : gameStatus === "created" && hasJoinedGame ? (
          <p className="joinedMessage">Joined Game</p>
        ) : null}

        {gameStatus === "active" && isUserInGame && (
          <div className="timeContainer">
            <p className="startText">Time Left</p>
            <div className="timer">
              <p className="startText">{formatTime(timeLeft)}</p>
            </div>

            <video
              ref={videoRef}
              className="videoFeed"
              autoPlay
              playsInline
              style={{ display: isRecording || videoBlob ? "block" : "none" }}
            />

            <div className="videoControls">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="videoButton"
              >
                {isRecording ? "Stop Recording" : "Record Pushups"}
              </button>
              {videoBlob && (
                <button onClick={submitVideo} className="videoButton">
                  Submit Video
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
