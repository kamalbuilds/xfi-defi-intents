import { Router } from "express";
import {
  getAllTransactions,
  getAllTransactionsByAddress,
  getTransactionByTransactionId,
  updateTransaction,
  deleteTransaction,
} from "./transaction.controller";

const txRouter = Router();

// get all transactions
txRouter.get("/", getAllTransactions);

// get transactions by address
txRouter.get("/address/:address", getAllTransactionsByAddress);

// get transaction by uuid
txRouter.get("/:transactionId", getTransactionByTransactionId);
txRouter.put("/:transactionId", updateTransaction);
txRouter.delete("/:transactionId", deleteTransaction);

export { txRouter };
