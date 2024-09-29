import { prisma } from ".";
import { Prisma, Transaction } from "@prisma/client";
import { Logger } from "../logger";
import { v4 as uuid } from "uuid";

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
  try {

    console.log(transaction.metadata,"metadata");
    const result = await prisma.transaction.create({
      data: {
        id: uuid(),
        fromAddress: transaction.fromAddress,
        metadata: {}, // Ensure metadata is in the correct format
      },
    });

    logger.log(result.fromAddress);
      logger.info(`Save Transaction: ${transaction.id}`);
      return result;
  } catch (error) {
    logger.error(`Error saving transaction: ${error}`);
  }
};


export const saveStakingTransaction = async (transaction: Transaction) => {
  try {

    console.log(transaction.metadata,"metadata");

    console.log(uuid().toString(),"uuid", uuid());
    const result = await prisma.transaction.create({
      data: {
        id: uuid().toString(),
        fromAddress: "0xA339276DcF328B77Be4d559658537342b5A0663b",
        metadata: {},
      },
    });

    logger.log(result.fromAddress);
      logger.info(`Save Transaction: ${transaction.id}`);
      return result;
  } catch (error) {
    logger.error(`Error saving transaction: ${error}`);
  }
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
