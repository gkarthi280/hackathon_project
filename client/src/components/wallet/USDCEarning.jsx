import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import USDC from "../../assets/USDC.png";
import Bridge from "./Bridge"; // Import the Bridge component

const USDCEarning = () => {
  const [showBridge, setShowBridge] = useState(false); // State to toggle bridge visibility

  const handleToggleBridge = () => {
    setShowBridge(!showBridge); // Toggle the bridge view
  };

  return (
    <div>
      <div style={styles.PumpRoyalEarningsContainer}>
        <img src={USDC} alt="USDC Coin" style={styles.pumpLogo} />
        <div style={{ flex: 1 }}>
          <h3 style={styles.pumpRoyalTitle}>USDC Coin</h3>
          <p style={styles.pumpRoyalText}>+$10,000.00</p>
        </div>
        <button style={styles.iconButton} onClick={handleToggleBridge}>
          <FaChevronRight color="white" />
        </button>
      </div>

      {/* Conditionally render the Bridge component */}
      {showBridge && <Bridge handleClose={handleToggleBridge} />}
    </div>
  );
};

export default USDCEarning;

const styles = {
  PumpRoyalEarningsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.22)",
    marginBottom: "20px",
    padding: "20px",
    marginTop: "60px",
    borderRadius: "20px",
    gap: "10px",
    width: "90vw",
  },
  pumpLogo: {
    width: "60px",
    height: "60px",
  },
  pumpRoyalTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "dodgerblue",
    margin: 0,
  },
  pumpRoyalText: {
    fontSize: "20px",
    color: "white",
    marginTop: "5px",
    fontWeight: "bold",
  },
  iconButton: {
    flex: 0.1,
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
    cursor: "pointer",
  },
};
