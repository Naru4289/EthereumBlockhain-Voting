import React, { useState, createContext } from "react";
import { BrowserProvider, Contract } from "ethers";
import { contractABI, contractAddress } from "../utils/Constant";

export const TransactionContext = createContext();

const { ethereum } = window;

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount"),
  );
  const [transactions, setTransactions] = useState([]);

  // ✅ Fix: Make this function async and properly await signer
  const createEthereumContract = async () => {
    if (!ethereum) throw new Error("Ethereum object not found");

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // ✅ Properly awaiting signer
    return new Contract(contractAddress, contractABI, signer);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async (election_id, candidate_id, user_id) => {
    try {
      if (!ethereum) return { valid: false, mess: "No ethereum object" };

      const transactionsContract = await createEthereumContract(); // ✅ Await here

      // Ensure currentAccount is admin
      const admin = await transactionsContract.getAdmin();
      if (currentAccount !== admin) {
        return { valid: false, mess: "Only the admin can perform this action" };
      }

      const transactionResponse = await transactionsContract.addToBlockchain(
        currentAccount, // sender is admin
        user_id,
        election_id,
        candidate_id,
      );

      console.log(`Loading - ${transactionResponse.hash}`);
      await transactionResponse.wait();
      console.log(`Success - ${transactionResponse.hash}`);

      const transactionsCount =
        await transactionsContract.getTransactionCount();
      setTransactionCount(transactionsCount);

      return { valid: true, mess: "Transaction Successful" };
    } catch (error) {
      console.error("Error in sendTransaction:", error);
      return {
        valid: false,
        mess:
          error.code === "ACTION_REJECTED"
            ? "User Rejected Transaction"
            : "Internal Send Transaction Error",
        error: error.message,
      };
    }
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return console.log("Ethereum is not present");

      const transactionsContract = await createEthereumContract(); // ✅ Await here

      const availableTransactions =
        await transactionsContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressFrom: transaction.from,
          timestamp: new Date(
            Number(transaction.timestamp) * 1000,
          ).toLocaleString(),
          election_id: transaction.election_id,
          candidate_id: transaction.candidate_id,
          user_id: transaction.user_id,
        }),
      );

      setTransactions(structuredTransactions);
      return structuredTransactions;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransaction,
        getAllTransactions,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
