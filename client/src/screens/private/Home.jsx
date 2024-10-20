import React from "react";
import Header from "../../components/Header";
import Greeting from "../../components/home/Greeting";
import Streak from "../../components/home/Streaks";
import Game from "../../components/home/Game";
import Widgets from "../../components/home/Widgets";

const Home = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        gap: 20,
        overflow: "scroll",
      }}
    >
      <div className="background">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <Header />
      <Greeting />
      <Streak />
      <Game />
      <Widgets />
    </div>
  );
};

export default Home;
