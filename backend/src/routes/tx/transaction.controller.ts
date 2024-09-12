import { Request, Response } from "express";
import { Logger } from "../../logger";
import {
  deleteTransactionById,
  getTransactionById,
  getTransactions,
  getTransactionsByUserAddress,
  updateTransactionHash,
} from "../../db/transaction";
import { getErrorMessage } from "../../lib/utils";

const logger = new Logger("transaction");

export async function getAllTransactions(req: Request, res: Response) {
  try {
    const data = await getTransactions();
    return res.status(200).json({
      status: "ok",
      data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(errorMessage);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}

export async function getAllTransactionsByAddress(req: Request, res: Response) {
  const { address } = req.params;
  logger.log(`received address: ${address}`);
  if (!address) return res.status(400).json({ message: "Wrong args" });

  try {
    const data = await getTransactionsByUserAddress(address);
    return res.status(200).json({
      status: "ok",
      data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(errorMessage);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}

export async function getTransactionByTransactionId(
  req: Request,
  res: Response
) {
  const { transactionId } = req.params;
  if (!transactionId) return res.status(400).json({ message: "Wrong args" });

  try {
    const data = await getTransactionById(transactionId);
    return res.status(200).json({
      status: "ok",
      data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(errorMessage);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}

export async function updateTransaction(req: Request, res: Response) {
  const { transactionId } = req.params;
  const { txHash } = req.body;
  if (!transactionId || !txHash)
    return res.status(400).json({ message: "Wrong args" });
  try {
    const data = await updateTransactionHash(transactionId, txHash);
    return res.status(200).json({
      status: "ok",
      data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(errorMessage);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  const { transactionId } = req.params;
  if (!transactionId) return res.status(400).json({ message: "Wrong args" });
  try {
    const data = await deleteTransactionById(transactionId);
    return res.status(200).json({
      status: "ok",
      data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(errorMessage);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}
