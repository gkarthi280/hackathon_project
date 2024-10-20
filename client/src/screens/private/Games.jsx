import React, { useState } from "react";
import Header from "../../components/Header";
import Public from "../../components/game/Public";
import Private from "../../components/game/Private";
const Games = () => {
  const [activeTab, setActiveTab] = useState("Public");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="background">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div style={styles.container}>
        <Header />
        <div style={styles.tabContainer}>
          <div
            onClick={() => handleTabClick("Public")}
            style={{
              ...styles.tab,
              color: activeTab === "Public" ? "#ffffff" : "#9e9e9e",
            }}
          >
            Public
          </div>
          <div
            onClick={() => handleTabClick("Private")}
            style={{
              ...styles.tab,
              color: activeTab === "Private" ? "#ffffff" : "#9e9e9e",
            }}
          >
            Private
          </div>
          <div
            style={{
              ...styles.underline,
              transform:
                activeTab === "Public" ? "translateX(0)" : "translateX(100%)",
            }}
          />
        </div>
        <div style={styles.content}>
          {activeTab === "Public" ? <Public /> : <Private />}
        </div>
      </div>
    </div>
  );
};

export default Games;

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    gap: 20,
    overflow: "hidden",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    width: "60%",
  },
  tab: {
    flex: 1,
    textAlign: "center",
    padding: "12px 0",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  underline: {
    position: "absolute",
    bottom: "-2px",
    left: 0,
    height: "2px",
    width: "50%",
    backgroundColor: "#ffffff",
    transition: "transform 0.3s ease",
  },
  content: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
