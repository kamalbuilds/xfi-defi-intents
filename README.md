# CrossFi DeFi Intents

**Tagline:** Execute DeFi actions on CrossFi with your prompts.

## Overview
CrossFi DeFi Intents is an innovative platform designed to simplify and streamline DeFi interactions directly from your wallet using intuitive prompts. Built on the CrossFi Chain, a modular blockchain that combines the power of Cosmos and Ethereum Virtual Machine (EVM), it allows users to perform actions like staking, swapping, and more within a unified and secure environment.

## Problem Statement
Navigating the DeFi landscape often requires juggling multiple platforms, apps, and interfaces, leading to a fragmented and time-consuming user experience. Security concerns, complex processes, and high transaction fees can hinder the seamless management of assets.

## Solution Statement
CrossFi DeFi Intents addresses these challenges by providing a single, user-friendly interface within your wallet. Using natural language prompts, users can perform DeFi actions such as staking, swapping, and managing assets with ease. The platform integrates advanced transaction insights, security features, and automated notifications, ensuring a secure and efficient DeFi experience.

## Key Features

### 1. **Prompt-Based DeFi Actions**
   - Execute a wide range of DeFi transactions directly from your wallet using simple prompts. Whether it’s staking, swapping, or transferring funds, CrossFi DeFi Intents streamlines these processes into a few clicks.
   - **Example:** Input a prompt like “Swap 14 XFI for XUSD” and receive a wallet popup to execute the transaction seamlessly.

### 2. **Advanced Transaction Insights**
   - Gain valuable insights into each transaction, including built-in security checks and real-time warnings when interacting with unverified contracts.
   - If a user attempts to interact with an unverified contract, they receive a warning and must acknowledge it before proceeding, enhancing the safety of every transaction.

### 3. **Automated Security Notifications**
   - Stay informed with optional security notifications that remind you to revoke approvals and secure your assets directly from MetaMask.
   - Easily set up automated approval revocation alerts through the CrossFi dashboard without needing a signature.

### 4. **Native Coin Support**
   - Supports CrossFi (XFI), a utility coin that facilitates access to all dApps, products, and services on the CrossFi Chain, and Mint Power (MPX), a governance coin used for staking and fee payments within the ecosystem.

### 5. **Integrated Protection and Simulations**
   - Integrated transaction simulations and automated approval revoking notifications protect users from potential scams and unauthorized actions. This feature enhances user confidence in conducting DeFi transactions on the CrossFi Chain.

## About CrossFi Chain
CrossFi Chain is a Layer 1 blockchain that combines the scalability of Cosmos with the smart contract capabilities of EVM. This unique modular architecture allows for a secure, efficient, and interoperable DeFi ecosystem.

- **Cosmos Module**: Handles consensus, block production, and transaction creation with a focus on speed and security using Tendermint and Cosmos SDK.
- **EVM Module**: Provides full compatibility with Ethereum, allowing for seamless deployment and interaction with smart contracts. Built with Ethermint and Evmos, this module ensures that CrossFi remains a robust and developer-friendly platform.

## Permissions  
CrossFi DeFi Intents requires permissions to access necessary APIs for its functionality. To view the complete list of permissions, refer to the [manifest.json](https://github.com/kamalbuilds/xfi-wallet/blob/main/packages/snap/snap.manifest.json).

## Demo Video  
Watch CrossFi DeFi Intents in action and see how it revolutionizes DeFi interactions: [Watch the demo](#).

### Please Note that Before this project : 

1. The knowledge base of brian had no clue of crossfi chain and its docs , so i had to train it from scratch on the xfi documentation and the xfi data available in the internet like the blog , XUSD docs , crossfi docs , github repos , medium blogs and the crossfi website.

2. The data extraction from the website was a bit challenging but we managed to scrape the data using scraping libraries and then stored it in a vector database ( by creating the "crossfi" KB ) for easy retrieval and querying.

The docs on which we trained brian were : 
1. https://docs.crossfi.org/
2.  https://github.com/crossfichain/docs
3. https://github.com/crossfichain/XUSD
4. https://medium.com/@crossfichain
5. https://www.crossfi.org

3. The prompt engineering was a crucial part of our implementation. We developed a system that extracts key parameters from user prompts, such as action type (swap, stake), token names, and amounts. These extracted parameters are then used to construct the appropriate transaction data. This approach allows us to handle a wide range of DeFi actions using natural language inputs.

4. The transaction simulation was a bit challenging since i had to parse the data 
and then pass it to the snapp for security purposes. I made a custom function for 
this purpose to store the verified contracts and then used it in the simulation 
process.

5. Brian does not support the CrossFi chain natively, so we implemented custom functions to handle CrossFi-specific transactions. Instead of using solvers, we built a system that:

a) Uses parameter extraction to understand the user's intent from the prompt.
b) Constructs transactions manually based on the extracted parameters.
c) Handles special cases like wrapping/unwrapping XFI and wXFI.
d) Supports staking for different tokens (lpMPX, lpXFI, lpUSD) with their respective contract addresses.
e) Builds swap transactions using the appropriate contract addresses and function selectors.

For example, a staking transaction for lpXFI tokens would be constructed as follows:
- Contract Address: 0x8D1dd64aC4306274585ad0BE302283A8D40a8383
- Function Selector: 0xa694fc3a (for "stake(uint256)")
- Data: Encoded amount to stake

This custom implementation allows us to create CrossFi-compatible transactions without relying on external solvers, ensuring full control over the transaction building process and enabling seamless integration with the CrossFi ecosystem.


## Monorepo Structure

This project consists of two main applications:

1. **Site**: Used for local installation, development, and testing.
2. **Snap**: Deployed to [NPM](https://www.npmjs.com/package/xfi-snapp).

## Installation and Usage  

To run the project locally:
1. Clone the repository.
2. Run `yarn` to install dependencies.
3. Start the project with `yarn start`.

For more detailed instructions on installing and testing the Snap, refer to the [Snap Installation Guide](https://github.com/kamalbuilds/xfi-wallet/tree/main/packages/snap#installation-guide).

## Contribution
We welcome contributions from the community! If you find any bugs or have feature suggestions, please open an issue or submit a pull request on GitHub.

## License
CrossFi DeFi Intents is licensed under the MIT License. For more information, see the [LICENSE](LICENSE) file.

---

CrossFi DeFi Intents makes DeFi easy, accessible, and secure. With its intuitive prompt-based interface, advanced security measures, and seamless integration with the CrossFi Chain, it’s the ultimate tool for DeFi enthusiasts looking to take control of their financial future.