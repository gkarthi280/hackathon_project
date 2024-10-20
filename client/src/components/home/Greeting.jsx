import React, { useContext } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { AuthContext } from "../../utils/AuthProvider";

const Greeting = () => {
  const { user } = useContext(AuthContext);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>
          Hello Bigshlak
        </h1>
        <p style={{ fontSize: "1rem", color: "white", marginTop: "4px" }}>
          Welcome back!
        </p>
      </div>
      <SlOptionsVertical color="white" size={20} />
    </div>
  );
};

export default Greeting;
