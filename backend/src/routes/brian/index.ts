import { Router } from "express";
import {
  fetchKnowledgeBase,
  fetchTransactionFromPrompt,
} from "./brian.controller";

const brianRouter = Router();

brianRouter.post("/transaction", fetchTransactionFromPrompt);
brianRouter.post("/knowledge-base", fetchKnowledgeBase);

export { brianRouter };
