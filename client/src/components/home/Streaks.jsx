import React from "react";
import { FaDumbbell, FaTimes } from "react-icons/fa";
import { MdHelpOutline } from "react-icons/md";

const Streak = () => {
  const week = [
    { day: "Mon", finished: "true" },
    { day: "Tue", finished: "false" },
    { day: "Wed", finished: "true" },
    { day: "Thu", finished: "true" },
    { day: "Fri", finished: "early" },
    { day: "Sat", finished: "early" },
    { day: "Sun", finished: "early" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.heading}>
        <h2 style={styles.headingText}>Your Streak</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={styles.subheadingText}>1X</span>
          <MdHelpOutline size={22} color="#ffff" />
        </div>
      </div>
      <div style={styles.streakContainer}>
        <div style={styles.weekContainer}>
          {week.map((day, index) => (
            <div key={index} style={styles.dayContainer}>
              <span style={styles.day}>{day.day}</span>
              {day.finished === "true" ? (
                <div style={{ ...styles.icon, backgroundColor: "#00cc66" }}>
                  <FaDumbbell size={20} color="white" />
                </div>
              ) : day.finished === "false" ? (
                <div style={{ ...styles.icon, backgroundColor: "#ff4d4d" }}>
                  <FaTimes size={20} color="white" />
                </div>
              ) : (
                <div style={{ ...styles.icon, backgroundColor: "#b0b0b0" }}>
                  <span style={{ color: "white", fontSize: "18px" }}>-</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={styles.totalContainer}>
          <span style={styles.totalText}>Current Streak</span>
          <span style={styles.totalNumber}>2 Days</span>
        </div>
        <div style={styles.nextMultiplier}>
          <span style={styles.nextMultiplierText}>
            5 more days to earn a <span style={styles.accent}>1.3X</span> on
            PUMP rewards
          </span>
        </div>
      </div>
    </div>
  );
};

export default Streak;

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "rgba(0, 255, 255, 0.2)",
    width: "100%",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
  heading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  headingText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
  subheadingText: {
    fontSize: "16px",
    color: "#fbc443",
  },
  streakContainer: {
    padding: "12px",
    borderRadius: "12px",
  },
  weekContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  dayContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },
  day: {
    color: "#d1d1d1",
    fontSize: "15px",
    fontWeight: "600",
  },
  icon: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s ease",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
  },
  totalContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
  },
  totalText: {
    fontSize: "17px",
    color: "white",
  },
  totalNumber: {
    fontSize: "17px",
    fontWeight: "bold",
    color: "#fbc443",
  },
  nextMultiplier: {
    marginTop: "8px",
  },
  nextMultiplierText: {
    fontSize: "14px",
    color: "lightgrey",
  },
  accent: {
    color: "#fbc443",
  },
};
