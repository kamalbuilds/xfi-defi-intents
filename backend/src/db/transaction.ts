import { prisma } from ".";
import { Prisma, Transaction } from "@prisma/client";
import { Logger } from "../logger";

const logger = new Logger("prisma-transaction");

export const getTransactions = async () => {
  return prisma.transaction.findMany();
};

// getTransactionsByUserAddress
export const getTransactionsByUserAddress = async (address: string) => {
  const result = prisma.transaction.findMany({
    where: {
      fromAddress: address,
    },
  });
  logger.info(`Get Transactions by User Address: ${address}`);
  return result;
};

// getTransactionById
export const getTransactionById = async (transactionId: string) => {
  const result = prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  });
  logger.info(`Get Transaction by Id: ${transactionId}`);
  return result;
};

// saveTransaction
export const saveTransaction = async (transaction: Transaction) => {
  const result = prisma.transaction.create({
    data: {
      id: transaction.id,
      fromAddress: transaction.fromAddress,
      metadata: transaction.metadata as Prisma.JsonObject,
    },
  });
  logger.info(`Save Transaction: ${transaction.id}`);
  return result;
};

// updateTransaction with txHash
export const updateTransactionHash = async (
  transactionId: Transaction["id"],
  txHash: Transaction["txHash"]
) => {
  const result = prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      txHash: txHash,
    },
  });
  logger.info(`Update Transaction: ${transactionId} ${txHash}`);
  return result;
};

// deleteTransaction
export const deleteTransactionById = async (transactionId: string) => {
  const result = prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
  logger.info(`Delete Transaction: ${transactionId}`);
  return result;
};
