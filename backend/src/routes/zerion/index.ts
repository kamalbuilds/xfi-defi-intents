import { Router } from "express";
import {
  fetchZerionFungibleTokens,
  fetchZerionPortfolio,
} from "./zerion.controller";

const zerionRounter = Router();

zerionRounter.get("/:address/portfolio", fetchZerionPortfolio);
zerionRounter.get("/:address/fungible-tokens", fetchZerionFungibleTokens);

export { zerionRounter };
