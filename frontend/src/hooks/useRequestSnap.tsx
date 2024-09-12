"use client";

import { version } from "os";

export const useRequestSnap = () => {
  const requestSnap = async () => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      const test = await window.ethereum.request({
        method: "wallet_requestSnaps",
        params: {
          // "npm:@solflare-wallet/solana-snap": {
          //   version: "^1.0.3",
          // },
          "local:http://localhost:8080": {},
          // "npm:@midenaeth/MetaIntents": {},
        },
      });
    }
  };

  return requestSnap;
};
