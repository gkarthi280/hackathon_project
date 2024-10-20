import Web3 from "web3";
import updatedGameAbi from "../../abis/UpdatedGame.json";
import usdcAbi from "../../abis/Usdc.json";

const waitForTransaction = async (web3, txHash) => {
  let transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
  while (transactionReceipt == null || transactionReceipt.status === false) {
    transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    await new Promise((r) => setTimeout(r, 4000));
  }
  return transactionReceipt;
};

export const initializeWeb3 = async () => {
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed or not connected.");
    return null;
  }
  let web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });
  return web3;
};

export const joinGameContract = async (
  contractAddress,
  usdcAddress,
  amount
) => {
  const web3 = await initializeWeb3();
  if (!web3) return;

  const accounts = await web3.eth.getAccounts();
  const playerAddress = accounts[0];

  // Instantiate USDC and UpdatedGame contracts
  const usdcContract = new web3.eth.Contract(usdcAbi, usdcAddress);
  const updatedGameContract = new web3.eth.Contract(
    updatedGameAbi,
    contractAddress
  );

  // STEP 1: Approve UpdatedGame contract to transfer USDC
  const amountWei = web3.utils.toWei(amount.toString(), "mwei");
  const approveTxGas = await usdcContract.methods
    .approve(contractAddress, amountWei)
    .estimateGas({ from: playerAddress });
  const approveTx = await usdcContract.methods
    .approve(contractAddress, amountWei)
    .send({ from: playerAddress, gas: approveTxGas });
  await waitForTransaction(web3, approveTx.transactionHash);
  console.log("USDC approved for joining the game");

  // STEP 2: Call joinGame function
  const joinTxGas = await updatedGameContract.methods
    .joinGame(amountWei)
    .estimateGas({ from: playerAddress });
  const joinTx = await updatedGameContract.methods
    .joinGame(amountWei)
    .send({ from: playerAddress, gas: joinTxGas });
  const joinTxReceipt = await waitForTransaction(web3, joinTx.transactionHash);
  console.log("JoinGameTxReceipt: ", joinTxReceipt);
};

export const returnBets = async (contractAddress, players) => {
  const web3 = await initializeWeb3();
  if (!web3) return;

  const accounts = await web3.eth.getAccounts();
  const ownerAddress = accounts[0];

  // Instantiate UpdatedGame contract
  const updatedGameContract = new web3.eth.Contract(
    updatedGameAbi,
    contractAddress
  );

  // STEP: Call returnBets function
  const returnBetsTxGas = await updatedGameContract.methods
    .returnBets(players)
    .estimateGas({ from: ownerAddress });
  const returnBetsTx = await updatedGameContract.methods
    .returnBets(players)
    .send({ from: ownerAddress, gas: returnBetsTxGas });
  const returnBetsTxReceipt = await waitForTransaction(
    web3,
    returnBetsTx.transactionHash
  );
  console.log("ReturnBetsTxReceipt: ", returnBetsTxReceipt);
};

export const payoutWinners = async (contractAddress, winners) => {
  const web3 = await initializeWeb3();
  if (!web3) return;

  const accounts = await web3.eth.getAccounts();
  const ownerAddress = accounts[0];

  // Instantiate UpdatedGame contract
  const updatedGameContract = new web3.eth.Contract(
    updatedGameAbi,
    contractAddress
  );

  // STEP: Call payoutWinners function
  const payoutWinnersTxGas = await updatedGameContract.methods
    .payoutWinners(winners)
    .estimateGas({ from: ownerAddress });
  const payoutWinnersTx = await updatedGameContract.methods
    .payoutWinners(winners)
    .send({ from: ownerAddress, gas: payoutWinnersTxGas });
  const payoutWinnersTxReceipt = await waitForTransaction(
    web3,
    payoutWinnersTx.transactionHash
  );
  console.log("PayoutWinnersTxReceipt: ", payoutWinnersTxReceipt);
};

export const getWinners = async (contractAddress, selectedPlayers) => {
  const web3 = await initializeWeb3();
  if (!web3) return;

  const accounts = await web3.eth.getAccounts();
  const ownerAddress = accounts[0];

  // Instantiate UpdatedGame contract
  const updatedGameContract = new web3.eth.Contract(
    updatedGameAbi,
    contractAddress
  );

  // STEP: Call getWinners function
  const winners = await updatedGameContract.methods
    .getWinners(selectedPlayers)
    .call({ from: ownerAddress });

  console.log("Selected winners: ", winners);
  return winners;
};
