import React, { useState, useContext } from "react";
import "./GameModal.css";
import { joinGame } from "../../utils/gameFunctions";
import { AuthContext } from "../../utils/AuthProvider";
import {
  FaGamepad,
  FaCheckCircle,
  FaRedo,
  FaBell,
  FaTimes,
} from "react-icons/fa";

const GameModal = ({ isVisible, onClose, showNotification }) => {
  const [step, setStep] = useState(1);
  const [stakeAmount, setStakeAmount] = useState("");
  const { user } = useContext(AuthContext);

  if (!isVisible) return null;

  const handleBridgeClick = () => {
    setStep(2);
  };

  const handleBackClick = () => {
    setStep(1);
  };

  const handleJoinClick = async () => {
    if (!user || !stakeAmount) {
      showNotification("Invalid stake amount or user not found.", <FaTimes />);
      return;
    }

    // Pass `showNotification` to `joinGame`
    const errorMessage = await joinGame(
      user._id,
      stakeAmount,
      showNotification
    );

    if (!errorMessage) {
      onClose(); // Close the modal on success
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {step === 1 && (
          <>
            <h2>Enter Stake Amount</h2>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount"
              className="stake-input"
            />

            <div style={{ width: "100%" }}>
              <button className="modal-button" onClick={handleBridgeClick}>
                Bridge
              </button>
              <button className="modal-button" onClick={handleJoinClick}>
                Join Game
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Bridge</h2>
            <p>Confirm your bridge to complete the staking process.</p>
            <button className="modal-button" onClick={handleBackClick}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameModal;
