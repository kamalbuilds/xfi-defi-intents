import { Request, Response } from "express";
import { Logger } from "../../logger";
import axios from "axios";
import { getErrorMessage } from "../../lib/utils";
import { env } from "../../env";

const logger = new Logger("zerion");
const ZERION_BASE_URL = env.ZERION_BASE_URL;

export async function fetchZerionPortfolio(req: Request, res: Response) {
  const { address } = req.params;

  logger.log(`received address: ${address}`);
  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  const options = {
    method: "GET",
    url: `${ZERION_BASE_URL}/wallets/${address}/portfolio?currency=usd`,
    headers: {
      accept: "application/json",
      authorization: `Basic ${env.ZERION_BASIC_AUTH}`,
    },
  };

  try {
    const { data } = await axios.request(options);

    return res.status(200).json({
      status: "ok",
      data: data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(`Error fetching Zerion portfolio: ${errorMessage}`);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}

export async function fetchZerionFungibleTokens(req: Request, res: Response) {
  const { address } = req.params;

  logger.log(`received address: ${address}`);
  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  const options = {
    method: "GET",
    url: `${ZERION_BASE_URL}/wallets/${address}/positions/?filter[positions]=only_simple&currency=usd&filter[trash]=only_non_trash&sort=value`,
    headers: {
      accept: "application/json",
      authorization: `Basic ${env.ZERION_BASIC_AUTH}`,
    },
  };

  try {
    const { data } = await axios.request(options);

    return res.status(200).json({
      status: "ok",
      data: data,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(`Error fetching Zerion portfolio: ${errorMessage}`);
    return res.status(500).json({
      status: "nok",
      error: {
        message: errorMessage,
      },
    });
  }
}
