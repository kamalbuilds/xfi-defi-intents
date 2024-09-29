import axios, { Axios, AxiosError } from "axios";
import { env } from "../../env";
import { Request, Response } from "express";
import { Logger } from "../../logger";
import { saveStakingTransaction, saveTransaction } from "../../db/transaction";
import { v4 as uuid } from "uuid";
import { PrismaClient } from "@prisma/client";
import { Transaction , StakingTransaction} from "@prisma/client";
import { getErrorMessage } from "../../lib/utils";
import web3 from "web3";

const BRIAN_BASE_URL = "https://api.brianknows.org/api/v0/agent";
const BRIAN_API_KEY = env.BRIAN_API_KEY;

const logger = new Logger("brian");


export async function fetchTransactionFromPrompt(req: Request, res: Response) {
  const { prompt, address } = req.body;

  logger.log(`received prompt: ${prompt}`);
  logger.log(`received address: ${address}`);
  // logger.log(`received chainId: ${chainId}`);
  if (!prompt || !address) {
    return res.status(400).json({ message: "Prompt and address are required" });
  }

  const sanitizedAddress = web3.utils.toChecksumAddress(address);

  const options = {
    method: "POST",
    url: `${BRIAN_BASE_URL}/transaction`,
    headers: {
      "Content-Type": "application/json",
      "X-Brian-Api-Key": BRIAN_API_KEY,
    },
    data: { prompt, address: sanitizedAddress, chainId: "1" },
  };

  try {
    const { data } = await axios.request(options);
    // save transaction to db
    // console.log("RAW data from Brian", JSON.stringify(data, null, 2));

    const newTransaction: Transaction = {
      id: uuid(),
      metadata: data?.result[0],
      fromAddress: address,
      txHash: null,
    };

    console.log(newTransaction,"new txn");

    logger.log(`Transaction from prompt: ${JSON.stringify(newTransaction)}`);
    const saveit = await saveTransaction(newTransaction); /// save transaction to db
    logger.log(`Transaction saved: ${JSON.stringify(saveit)}`);
    console.log(saveit,"saved");

    return res.status(200).json({
      status: "ok",
      id: newTransaction.id,
      fromAddress: newTransaction.fromAddress,
      data: newTransaction.metadata,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(`Error fetching transaction from prompt: ${errorMessage}`);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}

export async function storeStakingTransaction(req: Request, res: Response) {
  const { prompt, address, transaction } = req.body;

  logger.log(`Received prompt: ${prompt}`);
  logger.log(`Received address: ${address}`);

  if (!prompt || !address || !transaction) {
    return res.status(400).json({ message: "Prompt, address, and transaction data are required." });
  }

  const sanitizedAddress = web3.utils.toChecksumAddress(address);

  const newStakingTransaction: Transaction = {
    id: uuid(),
    fromAddress: sanitizedAddress,
    metadata: {
      prompt,
      transaction,
    },
    txHash: null,
  };

  try {
    const savedTransaction = await saveStakingTransaction(newStakingTransaction);
    logger.log(`Staking Transaction saved: ${JSON.stringify(savedTransaction)}`);
    res.status(200).json({
      status: "ok",
      id: newStakingTransaction.id,
      fromAddress: newStakingTransaction.fromAddress,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(`Error saving staking transaction: ${errorMessage}`);
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
