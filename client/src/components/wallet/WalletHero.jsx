import React, { useEffect, useState } from "react";
import {
  IoAddOutline,
  IoSwapHorizontalOutline,
  IoScanOutline,
} from "react-icons/io5";

const Digit = ({ targetDigit }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const position = targetDigit * 10 + 2; // Calculate position for the target digit
    setScrollPosition(position);
  }, [targetDigit]);

  return (
    <div style={styles.digitContainer}>
      <div
        style={{
          ...styles.digit,
          transform: `translateY(-${scrollPosition}%)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} style={styles.digitItem}>
            {i}
          </div>
        ))}
      </div>
    </div>
  );
};

const WalletHero = () => {
  const targetValue = 2348789; // Target wallet balance
  const targetDigits = targetValue.toString().split("").map(Number);

  // Insert commas into the target value for readability
  const formattedValue = targetValue.toLocaleString().split("").map(Number);

  return (
    <div style={styles.walletHeroContainer}>
      <div style={styles.titleContainer}>
        <h2 style={styles.title}>Your Wallet Balance</h2>
      </div>

      <div style={styles.balanceContainer}>
        <span style={styles.dollarSign}>$</span>
        {formattedValue.map((digit, index) =>
          isNaN(digit) ? (
            <span key={index} style={styles.comma}>
              ,
            </span>
          ) : (
            <Digit key={index} targetDigit={digit} />
          )
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.button}>
          <IoAddOutline size={24} color="white" />
          <span style={styles.buttonText}>Deposit</span>
        </button>

        <button style={styles.button}>
          <IoSwapHorizontalOutline size={24} color="white" />
          <span style={styles.buttonText}>Transfer</span>
        </button>

        <button style={styles.button}>
          <IoScanOutline size={24} color="white" />
          <span style={styles.buttonText}>Scan</span>
        </button>
      </div>
    </div>
  );
};

export default WalletHero;

const styles = {
  walletHeroContainer: {
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "60px",
  },
  titleContainer: {
    marginBottom: "5px",
    textAlign: "center",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.5)",
  },
  balanceContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dollarSign: {
    fontSize: "50px",
    fontWeight: "800",
    color: "white",
    marginRight: "5px",
  },
  digitContainer: {
    height: "50px",
    overflow: "hidden",
    width: "30px",
  },
  digit: {
    display: "flex",
    flexDirection: "column",
  },
  digitItem: {
    height: "50px",
    textAlign: "center",
    fontSize: "50px",
    fontWeight: "800",
    color: "white",
  },
  comma: {
    fontSize: "50px",
    fontWeight: "800",
    color: "white",
    lineHeight: "50px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "20px",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "10px 20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 5px",
    border: "none",
    cursor: "pointer",
  },
  buttonText: {
    color: "white",
    marginLeft: "10px",
    fontWeight: "bold",
  },
};
