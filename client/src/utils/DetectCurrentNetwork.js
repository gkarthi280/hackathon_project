const Web3 = require("web3");
const networks = require("./chains.json");

const initializeWeb3 = async () => {
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed or not connected.");
    return null;
  }
  let web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });
  return web3;
};

// Function to detect the current network
async function detectCurrentNetwork() {
  const web3 = await initializeWeb3();
  if (!web3) return;
  try {
    // Get the current chain ID
    const chainId = await web3.eth.getChainId();

    // Find the network that matches the current chain ID
    for (const [networkName, details] of Object.entries(networks)) {
      if (details.chainHexId && parseInt(details.chainHexId, 16) === chainId) {
        return networkName;
      }
    }

    // Return a message if no match is found
    return "Unknown Network";
  } catch (error) {
    console.error("Error detecting network:", error);
    return "Error";
  }
}
