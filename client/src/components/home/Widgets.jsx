import React from "react";

const Widgets = () => {
  const widgetsData = [
    {
      id: 1,
      label: "Total Gain",
      value: "-$50",
      colors: ["#FF5F6D", "#FFC371"],
    },
    {
      id: 2,
      label: "Pump Score",
      value: "120",
      colors: ["#FFC837", "#FF8008"],
    },
    {
      id: 3,
      label: "Highest Streak",
      value: "15 days",
      colors: ["#FFD700", "#FFA500"],
    },
    {
      id: 4,
      label: "Most Pushups",
      value: "80",
      colors: ["#28a745", "#5cb85c"],
    },
    {
      id: 5,
      label: "Games Joined",
      value: "12",
      colors: ["#5bc0de", "#428bca"],
    },
    {
      id: 6,
      label: "Multiplier",
      value: "1.1X",
      colors: ["#808080", "#b0b0b0"],
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Widgets</h2>
      </div>
      <div style={styles.widgetContainer}>
        {widgetsData.map((widget) => (
          <div
            key={widget.id}
            style={{
              ...styles.widgetCard,
            }}
          >
            <p style={styles.widgetValue}>{widget.value}</p>
            <p style={styles.widgetLabel}>{widget.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Widgets;

const styles = {
  container: {
    marginBottom: 80,
    width: "100%",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  editButton: {
    color: "#fbc443",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    maxWidth: "80px",
    textAlign: "right",
  },

  widgetContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 15,
  },
  widgetCard: {
    borderRadius: 16,
    width: "47.9%",
    height: 140,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  widgetLabel: {
    color: "#f0f0f0",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 10,
  },
  widgetValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },
};

// Apply hover effect in JavaScript using pseudo-classes
document.addEventListener("DOMContentLoaded", function () {
  const widgetCards = document.querySelectorAll(".widgetCard");

  widgetCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.05)";
      card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "scale(1)";
      card.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)";
    });
  });
});
