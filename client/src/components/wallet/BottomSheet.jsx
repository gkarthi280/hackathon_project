import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { FaChevronUp, FaChevronDown, FaChevronRight } from "react-icons/fa";
import USDC from "../../assets/USDC.png";

const transactions = [
  { id: "1", gameID: "Game 1", amount: "+0.5", positive: true },
  { id: "2", gameID: "Game 2", amount: "-0.2", positive: false },
  { id: "3", gameID: "Game 3", amount: "+1.0", positive: true },
  { id: "4", gameID: "Game 4", amount: "-0.1", positive: false },
  { id: "5", gameID: "Game 5", amount: "+0.8", positive: true },
  { id: "6", gameID: "Game 6", amount: "-0.3", positive: false },
  { id: "7", gameID: "Game 7", amount: "+0.6", positive: true },
  { id: "8", gameID: "Game 8", amount: "-0.4", positive: false },
];

const BottomSheet = () => {
  const screenHeight = window.innerHeight;
  const collapsedHeight = screenHeight * 0.3;
  const expandedHeight = screenHeight * 0.7;
  const [isExpanded, setIsExpanded] = useState(false);

  const [{ height }, api] = useSpring(() => ({ height: collapsedHeight }));

  const toggleHeight = () => {
    setIsExpanded((prev) => !prev);
    api.start({ height: isExpanded ? collapsedHeight : expandedHeight });
  };

  const renderTransaction = ({ id, gameID, amount, positive }) => (
    <div key={id} style={styles.transactionContainer}>
      <img src={USDC} alt="USDC Coin" style={styles.coinImage} />
      <div style={styles.transactionDetails}>
        <span style={styles.gameID}>{gameID}</span>
        <span
          style={{
            ...styles.amount,
            color: positive ? "#4caf50" : "#e57373",
          }}
        >
          {amount} USDC
        </span>
      </div>
      <FaChevronRight size={20} color="#b0b0b0" />
    </div>
  );

  return (
    <animated.div
      style={{
        ...styles.bottomSheet,
        height,
        zIndex: 10,
      }}
    >
      <div style={styles.toggleButtonContainer}>
        <button onClick={toggleHeight} style={styles.toggleButton}>
          {isExpanded ? <FaChevronDown size={20} /> : <FaChevronUp size={20} />}
        </button>
      </div>
      <div style={styles.header}>
        <h2 style={styles.title}>Transaction History</h2>
      </div>
      <div style={styles.transactionsList}>
        {transactions.map(renderTransaction)}
      </div>
    </animated.div>
  );
};

export default BottomSheet;

const styles = {
  bottomSheet: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#2c2c2c",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    boxShadow: "0px -5px 15px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    marginBottom: "60px", // Space for bottom navigation
  },
  toggleButtonContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    outline: "none",
  },
  header: {
    padding: "10px 10px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1f1f1f",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#ffffff",
    margin: 0,
  },
  transactionsList: {
    overflowY: "auto",
    padding: "10px 20px",
    backgroundColor: "#1f1f1f",
  },
  transactionContainer: {
    display: "flex",
    alignItems: "center",
    padding: "15px 10px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    transition: "background 0.2s",
    marginBottom: "8px",
    backgroundColor: "#383838",
  },
  coinImage: {
    width: "40px",
    height: "40px",
    marginRight: "15px",
    borderRadius: "50%",
    border: "2px solid rgba(255, 255, 255, 0.2)",
  },
  transactionDetails: {
    flex: 1,
  },
  gameID: {
    fontSize: "16px",
    color: "#ffffff",
    marginBottom: "3px",
    fontWeight: "500",
  },
  amount: {
    fontSize: "16px",
    fontWeight: "bold",
  },
};
