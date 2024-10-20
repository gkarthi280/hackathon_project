import { ConnectButton } from "thirdweb/react";
import { client } from "../../client";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { bridgeUSDC } from "../../utils/CCTPBridge";
import {
  avalancheFuji,
  sepolia,
  ethereum,
  base,
  polygon,
  arbitrum,
} from "thirdweb/chains";
import { useNetworkSwitcherModal } from "thirdweb/react";
import "./Bridge.css";

// Simplified networkChainIds
const networkChainIds = {
  ethSepolia: "0xaa36a7",
  baseSepolia: "0x14a33",
  avaxFuji: "0xa869",
};

const Bridge = ({ handleClose }) => {
  const [ethSignerAddress, setEthSignerAddress] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [sourceNetwork, setSourceNetwork] = useState("");
  const [targetNetwork, setTargetNetwork] = useState("");
  const [amount, setAmount] = useState("");

  const networks = [
    { id: "Eth Sepolia", name: "Eth Sepolia" },
    { id: "Base Sepolia", name: "Base Sepolia" },
    { id: "Avax Fuji", name: "Avax Fuji" },
  ];

  // Connect MetaMask and get the active account
  async function connectMetaMask() {
    if (typeof window.ethereum === "undefined") {
      setErrorMessage("MetaMask is not installed or not connected.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const ethSignerAddress = accounts[0];
      setEthSignerAddress(ethSignerAddress);

      const balanceInWei = await web3.eth.getBalance(ethSignerAddress);
      const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");
      setEthBalance(balanceInEth);
    } catch (error) {
      setErrorMessage("Error connecting to MetaMask.");
    }
  }

  // Handle network switch
  async function switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      console.log("Error switching network:", switchError);
    }
  }

  // Handle account changes (e.g., when the user switches accounts)
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setEthSignerAddress(accounts[0]);

          const web3 = new Web3(window.ethereum);
          web3.eth.getBalance(accounts[0]).then((balanceInWei) => {
            const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");
            setEthBalance(balanceInEth);
          });
        } else {
          setEthSignerAddress(null);
          setEthBalance(null);
          setErrorMessage("No account connected.");
        }
      });
    }

    connectMetaMask();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  const handleDisconnect = () => {
    setEthSignerAddress(null);
    setEthBalance(null);
    setErrorMessage("No account connected.");
  };

  return (
    <main className="bridge-container">
      <div className="nav">
        <button onClick={handleClose}>
          <p>Back</p>
        </button>
        <ConnectButton client={client} onDisconnect={handleDisconnect} />
      </div>

      <header className="header">
        <h1>Bridge</h1>
        <p>Transfer your USDC between chains.</p>
      </header>

      <div className="content">
        <div className="usdc-bridge">
          <div className="network-picker">
            <label htmlFor="source-network">Source Network</label>
            <select
              id="source-network"
              value={sourceNetwork}
              onChange={(e) => setSourceNetwork(e.target.value)}
              className="select"
            >
              {networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </select>
          </div>

          <div className="network-picker">
            <label htmlFor="target-network">Target Network</label>
            <select
              id="target-network"
              value={targetNetwork}
              onChange={(e) => setTargetNetwork(e.target.value)}
              className="select"
            >
              {networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </select>
          </div>

          <div className="amount-input">
            <label htmlFor="usdc-amount">Amount to Bridge (USDC)</label>
            <input
              type="number"
              id="usdc-amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
          </div>

          <button
            className="bridge-button"
            onClick={() => {
              if (!amount) {
                console.error("Please enter an amount to bridge.");
                return;
              }
              bridgeUSDC(sourceNetwork, targetNetwork, amount)
                .then(() => console.log("USDC bridge transaction successful"))
                .catch((error) =>
                  console.error("Error in bridging USDC:", error)
                );
            }}
          >
            Bridge USDC
          </button>
        </div>

        <div className="account-info">
          {ethSignerAddress ? (
            <p>
              Connected MetaMask Account: {ethSignerAddress} <br />
              Balance: {ethBalance} ETH
            </p>
          ) : (
            <p>{errorMessage ? errorMessage : "No account connected"}</p>
          )}
        </div>
      </div>
    </main>
  );
};
export default Bridge;
