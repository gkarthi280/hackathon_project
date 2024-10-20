import Web3 from "web3";
import tokenMessengerAbi from "../../abis/cctp/TokenMessenger.json";
import usdcAbi from "../../abis/Usdc.json";
import messageTransmitterAbi from "../../abis/cctp/MessageTransmitter.json";
import chainInfo from "./chains.json";

const waitForTransaction = async (web3, txHash) => {
  let transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
  while (transactionReceipt == null || transactionReceipt.status === false) {
    transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    await new Promise((r) => setTimeout(r, 4000));
  }
  return transactionReceipt;
};

const switchToNetwork = async (chainIdHex) => {
  try {
    // Attempt to switch to the target network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    console.log(
      `Successfully switched to network with chain ID: ${chainIdHex}`
    );
  } catch (switchError) {
    console.log("oops!");
  }
};

export const bridgeUSDC = async (fromChain, toChain, amount) => {
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed or not connected.");
    return;
  }
  // Use MetaMask's provider
  let web3 = new Web3(window.ethereum);

  // Request accounts and get the active MetaMask account
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const accounts = await web3.eth.getAccounts();
  const ethSignerAddress = accounts[0];
  console.log("Using MetaMask account:", ethSignerAddress);

  // Get the current chain ID
  const currentChainId = await web3.eth.getChainId();
  if (currentChainId !== parseInt(chainInfo[fromChain].chainHexId, 16)) {
    console.log(`Please switch to Ethereum Sepolia network.`);
    await switchToNetwork(chainInfo[fromChain].chainHexId);
  }

  // Initialize contracts on the Ethereum network
  const fromTokenMessengerContract = new web3.eth.Contract(
    tokenMessengerAbi,
    chainInfo[fromChain].usdcTokenMessengerCA,
    { from: ethSignerAddress }
  );
  const usdcFromContract = new web3.eth.Contract(
    usdcAbi,
    chainInfo[fromChain].usdcTokenCA,
    { from: ethSignerAddress }
  );
  const toMessageTransmitterContract = new web3.eth.Contract(
    messageTransmitterAbi,
    chainInfo[toChain].usdcMessageTransmitterCA
  );

  // Destination details
  const mintRecipient = ethSignerAddress;
  const destinationAddressInBytes32 = web3.utils.padLeft(mintRecipient, 64);
  const amountWei = web3.utils.toWei(amount.toString(), "mwei");

  // STEP 1: Approve the messenger contract to withdraw from the MetaMask address
  const approveTxGas = await usdcFromContract.methods
    .approve(chainInfo[fromChain].usdcTokenMessengerCA, amountWei)
    .estimateGas({ from: ethSignerAddress });
  const approveTx = await usdcFromContract.methods
    .approve(chainInfo[fromChain].usdcTokenMessengerCA, amountWei)
    .send({ from: ethSignerAddress, gas: approveTxGas });
  const approveTxReceipt = await waitForTransaction(
    web3,
    approveTx.transactionHash
  );
  console.log("ApproveTxReceipt: ", approveTxReceipt);

  // STEP 2: Burn USDC on source
  const burnTxGas = await fromTokenMessengerContract.methods
    .depositForBurn(
      amountWei,
      chainInfo[toChain].destinationDomain,
      destinationAddressInBytes32,
      chainInfo[fromChain].usdcTokenCA
    )
    .estimateGas({ from: ethSignerAddress });
  const burnTx = await fromTokenMessengerContract.methods
    .depositForBurn(
      amountWei,
      chainInfo[toChain].destinationDomain,
      destinationAddressInBytes32,
      chainInfo[fromChain].usdcTokenCA
    )
    .send({ from: ethSignerAddress, gas: burnTxGas });
  const burnTxReceipt = await waitForTransaction(web3, burnTx.transactionHash);
  console.log("BurnTxReceipt: ", burnTxReceipt);

  // STEP 3: Retrieve message bytes from logs
  const transactionReceipt = await web3.eth.getTransactionReceipt(
    burnTx.transactionHash
  );
  const eventTopic = web3.utils.keccak256("MessageSent(bytes)");
  const log = transactionReceipt.logs.find((l) => l.topics[0] === eventTopic);
  const messageBytes = web3.eth.abi.decodeParameters(["bytes"], log.data)[0];
  const messageHash = web3.utils.keccak256(messageBytes);
  console.log(`MessageBytes: ${messageBytes}`);
  console.log(`MessageHash: ${messageHash}`);

  // STEP 4: Fetch attestation signature from Circle API
  let attestationResponse = { status: "pending" };
  while (attestationResponse.status !== "complete") {
    const response = await fetch(
      `https://iris-api-sandbox.circle.com/attestations/${messageHash}`
    );
    attestationResponse = await response.json();
    await new Promise((r) => setTimeout(r, 2000));
  }
  const attestationSignature = attestationResponse.attestation;
  console.log(`Signature: ${attestationSignature}`);

  // STEP 5: Switch to target network and receive the funds
  if (
    (await web3.eth.getChainId()) !==
    parseInt(chainInfo[toChain].chainHexId, 16)
  ) {
    console.log("Switching to Target Chain...");
    await switchToNetwork(chainInfo[toChain].chainHexId); // Prompt to switch to target chain
  }

  // Use the target network's Web3 provider
  web3 = new Web3(window.ethereum); // Reinitialize after network switch

  const receiveTxGas = await toMessageTransmitterContract.methods
    .receiveMessage(messageBytes, attestationSignature)
    .estimateGas({ from: ethSignerAddress });
  const receiveTx = await toMessageTransmitterContract.methods
    .receiveMessage(messageBytes, attestationSignature)
    .send({ from: ethSignerAddress, gas: receiveTxGas });
  const receiveTxReceipt = await waitForTransaction(
    web3,
    receiveTx.transactionHash
  );
  console.log("ReceiveTxReceipt: ", receiveTxReceipt);
};
