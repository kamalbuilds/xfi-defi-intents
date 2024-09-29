import { Router } from "express";
import {
  fetchKnowledgeBase,
  fetchTransactionFromPrompt,
  storeStakingTransaction,
} from "./brian.controller";

const brianRouter = Router();

brianRouter.post("/transaction", fetchTransactionFromPrompt);
brianRouter.post("/knowledge-base", fetchKnowledgeBase);
brianRouter.post("/staking", storeStakingTransaction);

export { brianRouter };
