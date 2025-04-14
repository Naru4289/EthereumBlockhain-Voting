FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install required dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    curl

# Install Solidity compiler (specific version 0.5.16)
RUN curl -fsSL https://binaries.soliditylang.org/linux-amd64/solc-linux-amd64-v0.5.16+commit.9c3226ce -o /usr/local/bin/solc \
    && chmod +x /usr/local/bin/solc

# Install Truffle, Ganache, and Web3.js
RUN npm install -g truffle@5.11.5 ganache@7.9.1 web3@1.10.0

# Set default shell
SHELL ["/bin/bash", "-c"]
