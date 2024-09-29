import axios from "axios";
import { env } from "../../env";
import { Request, Response } from "express";
import { Logger } from "../../logger";
import { saveTransaction } from "../../db/transaction";
import { v4 as uuid } from "uuid";
import { Transaction } from "@prisma/client";
import { getErrorMessage } from "../../lib/utils";
import web3 from "web3";
import { ethers } from 'ethers';
import { tokenList } from './tokenList';

const BRIAN_BASE_URL = "https://api.brianknows.org/api/v0/agent";
const BRIAN_API_KEY = env.BRIAN_API_KEY;

const logger = new Logger("brian");

export async function fetchTransactionFromPrompt(req: Request, res: Response) {
  const { prompt, address } = req.body;

  logger.log(`received prompt: ${prompt}`);
  logger.log(`received address: ${address}`);

  if (!prompt || !address) {
    return res.status(400).json({ message: "Prompt and address are required" });
  }

  const sanitizedAddress = web3.utils.toChecksumAddress(address);

  try {
    // First, call the parameter extraction API
    const extractionOptions = {
      method: "POST",
      url: `${BRIAN_BASE_URL}/parameters-extraction`,
      headers: {
        "Content-Type": "application/json",
        "X-Brian-Api-Key": BRIAN_API_KEY,
      },
      data: { prompt },
    };

    const { data: extractionData } = await axios.request(extractionOptions);
    const params = extractionData.result.completion[0];

    let transactionData;

    if (params.action?.toLowerCase() === 'swap') {
      // Handle swap transaction
      transactionData = await buildSwapTransaction(params, sanitizedAddress);
    } else if (params.action?.toLowerCase() === 'stake') {
      // Handle staking transaction
      transactionData = await storeStakingTransaction(req, res);
      return; // storeStakingTransaction already sends the response
    } else {
      // For other actions, proceed with the original logic
      const options = {
        method: "POST",
        url: `${BRIAN_BASE_URL}/transaction`,
        headers: {
          "Content-Type": "application/json",
          "X-Brian-Api-Key": BRIAN_API_KEY,
        },
        data: { prompt, address: sanitizedAddress, chainId: "1" },
      };

      const { data } = await axios.request(options);
      transactionData = data?.result[0];
    }

    const newTransaction: Transaction = {
      id: uuid(),
      metadata: transactionData,
      fromAddress: address,
      txHash: null,
    };

    logger.log(`Transaction from prompt: ${JSON.stringify(newTransaction)}`);
    const saveit = await saveTransaction(newTransaction);
    logger.log(`Transaction saved: ${JSON.stringify(saveit)}`);

    return res.status(200).json({
      status: "ok",
      id: newTransaction.id,
      fromAddress: newTransaction.fromAddress,
      data: newTransaction.metadata,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(`Error processing transaction from prompt: ${errorMessage}`);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}

async function buildSwapTransaction(params: any, address: string) {
  const fromToken = tokenList[params.fromToken.toUpperCase()];
  const toToken = tokenList[params.toToken.toUpperCase()];

  if (!fromToken || !toToken) {
    throw new Error('Unsupported token for swapping');
  }

  const wXFIAddress = '0x28cC5eDd54B1E4565317C3e0Cfab551926A4CD2a';

  // Check if it's a wrap or unwrap operation
  if (fromToken.symbol === 'XFI' && toToken.address === wXFIAddress) {
    // Wrapping XFI to wXFI
    const amountIn = ethers.utils.parseUnits(params.amount.toString(), 18);
    return {
      to: wXFIAddress,
      data: '0xd0e30db0', // Deposit function selector
      value: amountIn.toString(),
      from: address,
    };
  } else if (fromToken.address === wXFIAddress && toToken.symbol === 'XFI') {
    // Unwrapping wXFI to XFI
    const amountIn = ethers.utils.parseUnits(params.amount.toString(), 18);
    const data = ethers.utils.defaultAbiCoder.encode(['uint256'], [amountIn]);
    return {
      to: wXFIAddress,
      data: '0x2e1a7d4d' + data.slice(2), // Withdraw function selector
      value: '0',
      from: address,
    };
  } else {
    // Regular swap
    const amountIn = ethers.utils.parseUnits(params.amount.toString(), fromToken.decimals);
    const amountOutMin = 0; // In prod we will calculate this based on expected slippage
    const path = [fromToken.address, toToken.address];
    const to = address;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    const data = ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
      [amountIn, amountOutMin, path, to, deadline]
    );

    return {
      to: '0x63214cB45714b55e17bc58dd879BdD62EE1B024b', // XFI Swap contract address
      data: '0x38ed1739' + data.slice(2), // Add the function selector for "swapExactTokensForTokens"
      value: '0',
      from: address,
    };
  }
}

export async function storeStakingTransaction(req: Request, res: Response) {
  const { prompt, address } = req.body;

  logger.log(`Received prompt: ${prompt}`);
  logger.log(`Received address: ${address}`);

  if (!prompt || !address) {
    return res.status(400).json({ message: "Prompt and address are required." });
  }

  const sanitizedAddress = web3.utils.toChecksumAddress(address);

  try {
    // Call the parameter extraction API
    const extractionOptions = {
      method: "POST",
      url: `${BRIAN_BASE_URL}/parameters-extraction`,
      headers: {
        "Content-Type": "application/json",
        "X-Brian-Api-Key": BRIAN_API_KEY,
      },
      data: { prompt },
    };

    const { data: extractionData } = await axios.request(extractionOptions);
    const params = extractionData.result.completion[0];

    // Build the transaction based on the extracted parameters
    let to, data;
    if (params.token?.toLowerCase() === 'lpmpx') {
      to = '0x98F5942eC3Cbc6361d36fC090C615BfaA4E55E92'; // lpMPX token address
      const amount = ethers.utils.parseUnits(params.amount.toString(), 18); // Assuming 18 decimals
      data = ethers.utils.defaultAbiCoder.encode(['uint256'], [amount]);
      data = '0xa694fc3a' + data.slice(2); // Add the function selector for "stake(uint256)"
    } else if (params.token?.toLowerCase() === 'lpxfi') {
      to = '0x8D1dd64aC4306274585ad0BE302283A8D40a8383'; // lpXFI token address
      const amount = ethers.utils.parseUnits(params.amount.toString(), 18); // Assuming 18 decimals
      data = ethers.utils.defaultAbiCoder.encode(['uint256'], [amount]);
      data = '0xa694fc3a' + data.slice(2); // Add the function selector for "stake(uint256)"
    } else if (params.token?.toLowerCase() === 'lpUSD') {
      const amount = ethers.utils.parseUnits(params.amount.toString(), 18); // Assuming 18 decimals
      data = ethers.utils.defaultAbiCoder.encode(['uint256'], [amount]);
      data = '0xa694fc3a' + data.slice(2); // Add the function selector for "stake(uint256)"
      to = '0xc74b7350776ef5d4d10cecfad7C84b3E5A13a9F4'; // XFI Staking contract address
    } else {
      throw new Error('Unsupported token for staking');
    }

    const newStakingTransaction: Transaction = {
      id: uuid(),
      fromAddress: sanitizedAddress,
      metadata: {
        prompt,
        extractedParams: params,
        to,
        data,
      },
      txHash: null,
    };

    const savedTransaction = await saveStakingTransaction(newStakingTransaction);
    logger.log(`Staking Transaction saved: ${JSON.stringify(savedTransaction)}`);
    res.status(200).json({
      status: "ok",
      id: newStakingTransaction.id,
      fromAddress: newStakingTransaction.fromAddress,
      to,
      data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(`Error processing staking transaction: ${errorMessage}`);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}


export async function fetchKnowledgeBase(req: Request, res: Response) {
  const { prompt, kb } = req.body;

  logger.log(`received prompt: ${prompt} and kb: ${kb}`);
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  const options = {
    method: "POST",
    url: `${BRIAN_BASE_URL}/knowledge`,
    headers: {
      "Content-Type": "application/json",
      "X-Brian-Api-Key": BRIAN_API_KEY,
    },
    data: { prompt, kb },
  };

  try {
    const { data } = await axios.request(options);

    return res.status(200).json({
      status: "ok",
      data: data.result,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(`Error fetching knowledge base: ${errorMessage}`);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}
