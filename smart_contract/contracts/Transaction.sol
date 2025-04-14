// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transaction {
    uint256 private transactionCounter; // Made private for encapsulation

    address public admin; // Admin address to manage the contract

    // Event for logging transfers
    event Transfer(
        address indexed from,
        address indexed receiver,
        string user_id,
        string election_id,
        string candidate_id,
        uint256 timestamp
    );

    // Structure to store transaction details
    struct TransactionStruct {
        address from;
        address receiver;
        string user_id;
        string election_id;
        string candidate_id;
        uint256 timestamp;
    }

    // Array to store all transactions
    TransactionStruct[] private transactions;

    // Modifier to restrict certain functions to admin only
    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not authorized to perform this action");
        _;
    }

    // Constructor to set the deployer as the admin
    constructor() {
        admin = msg.sender;
    }

    // Function to add a transaction to the blockchain
    function addToBlockchain(
        address receiver,
        string memory user_id,
        string memory election_id,
        string memory candidate_id
    ) public onlyAdmin {
        require(receiver != address(0), "Invalid receiver address");
        require(bytes(user_id).length > 0, "User ID cannot be empty");
        require(bytes(election_id).length > 0, "Election ID cannot be empty");
        require(bytes(candidate_id).length > 0, "Candidate ID cannot be empty");

        transactionCounter++;
        transactions.push(
            TransactionStruct(
                msg.sender,
                receiver,
                user_id,
                election_id,
                candidate_id,
                block.timestamp
            )
        );

        emit Transfer(msg.sender, receiver, user_id, election_id, candidate_id, block.timestamp);
    }

    // Function to fetch all transactions
    function getAllTransactions() public view returns (TransactionStruct[] memory) {
        return transactions;
    }

    // Function to fetch the transaction count
    function getTransactionCount() public view returns (uint256) {
        return transactionCounter;
    }

    // Function to change the admin address
    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }

    // Function to fetch the current admin address
    function getAdmin() public view returns (address) {
        return admin;
    }
}
