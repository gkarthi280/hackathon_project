import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthProvider";
import "./Auth.css";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import axios from "axios";
import { client } from "../../client";
import logo from "../../assets/logo.png";

function Register() {
  const { setUser, walletAddress, setWalletAddress } = useContext(AuthContext);
  const activeAccount = useActiveAccount();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (activeAccount) {
      setWalletAddress(activeAccount.address);
      console.log("Connected wallet address:", activeAccount.address);
    }
  }, [activeAccount, setWalletAddress]);

  const handleRegister = async () => {
    if (!walletAddress) {
      setError("Please connect your wallet to continue.");
      return;
    }

    try {
      const response = await axios.post(
        "https://10.77.0.149:8000/user/register",
        {
          username,
          email,
          password,
          walletAddress,
        }
      );

      if (response.status === 201) {
        setUser(response.data.user);
        navigate("/home");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred during registration"
      );
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="background">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="top">
        <img src={logo} alt="Pump Royale logo" />
        <p>PUMPROYALE</p>
      </div>
      <div className="middle">
        <h2>Create</h2>
        <h2>Account</h2>
      </div>
      <div className="bottom">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <ConnectButton client={client} />
          <button className="button" onClick={handleRegister}>
            Register
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
