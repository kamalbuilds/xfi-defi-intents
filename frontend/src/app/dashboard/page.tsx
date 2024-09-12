"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { GetTxResult } from "../tx/[transactionId]/page";
import axios, { AxiosResponse } from "axios";
import { TokenDetails } from "@/components/TokenDetails";
import { getShortAddress } from "@/lib/utils";

// go here to see other chains https://www.blockscout.com/chains-and-projects
const getBlockscoutUrl = (chainId: number | undefined) => {
  const chainIdToBlockscoutUrl: { [key: number]: string } = {
    1: "https://eth.blockscout.com",
    59144: "https://explorer.linea.build",
    // testnets
    11155111: "https://eth-sepolia.blockscout.com",
    59141: "https://explorer.sepolia.linea.build",
  };
  if (!chainId) return chainIdToBlockscoutUrl[1];
  if (chainId in chainIdToBlockscoutUrl) return chainIdToBlockscoutUrl[chainId];
  return chainIdToBlockscoutUrl[1];
};

const DashboardPage = () => {
  const [isPersonal, setIsPersonal] = useState<boolean>(false);
  const [isLoadingTransactions, setIsLoadingTransactions] =
    useState<boolean>(true);

  const [transactions, setTransactions] = useState<GetTxResult[]>([]);
  const account = useAccount();

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch(`/api/tx/`);
      const data = await response.json();
      setTransactions(data.tx.data);
      setIsLoadingTransactions(false);
    }
    fetchTransactions();
  }, []);

  const getAllTransactions = async () => {
    setIsPersonal(false);
    setIsLoadingTransactions(true);
    const response = await fetch(`/api/tx/`);
    const data = await response.json();
    setTransactions(data.tx.data);
    setIsLoadingTransactions(false);
  };

  const getMyTransactions = async () => {
    setIsPersonal(true);
    setIsLoadingTransactions(true);
    const response = await fetch(`/api/tx/account/${account.address}`);
    const data = await response.json();
    setTransactions(data.tx.data);
    setIsLoadingTransactions(false);
  };

  return (
    <div className="flex flex-col text-white w-full">
      <section className="flex flex-col gap-5 items-center justify-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="overflow-x-auto h-[60vh] w-[80vw]">
          <div role="tablist" className="tabs tabs-boxed w-[50%]">
            <a
              role="tab"
              className={`tab ${isPersonal ? "" : "tab-active"}`}
              onClick={getAllTransactions}
            >
              All Transaction
            </a>
            <a
              role="tab"
              className={`tab ${isPersonal ? "tab-active" : ""}`}
              onClick={getMyTransactions}
            >
              My Transactions
            </a>
          </div>
          <div className={`collapse bg-transparent`}>
            <div className="collapse-title text-xl font-medium w-full flex gap-1 justify-between">
              <p className="w-fit mr-4">Id</p>
              <p className="w-1/5">Transaction</p>
              <p className="w-1/5">Action</p>
              <div className="flex gap-1 w-1/5">Solver</div>
              <p className="w-1/5">From Address</p>
              <p className="w-1/5">Details</p>
            </div>
          </div>
          {!isLoadingTransactions && transactions
            ? transactions.map((tx, index) => (
                <details
                  className={`collapse ${index % 2 === 0 ? "bg-base-300" : "bg-base-100"}`}
                  key={tx.id}
                >
                  <summary className="collapse-title text-xl font-medium">
                    <div className="w-full flex gap-1 justify-between">
                      <p className="w-fit">{index + 1}</p>
                      <p className="w-1/6" style={{ zIndex: 1 }}>
                        <a
                          href={
                            tx.txHash
                              ? `${getBlockscoutUrl(tx.metadata.data.fromChainId)}/address/${tx.txHash}`
                              : undefined
                          }
                          target="_blank"
                          style={{ zIndex: 10 }}
                          className={tx.txHash ? "" : "bg-none cursor-default"}
                        >
                          {tx.txHash
                            ? getShortAddress(tx.txHash)
                            : "Not Published yet"}
                        </a>
                      </p>
                      <p className="w-1/6">
                        {tx.metadata?.action.charAt(0).toUpperCase() +
                          tx.metadata?.action.slice(1)}
                      </p>
                      <div className="flex gap-1 w-1/6">
                        {tx.metadata?.solver.charAt(0).toUpperCase() +
                          tx.metadata?.solver.slice(1)}
                        <Image
                          src={`/images/${tx.metadata?.solver.toLowerCase()}_logo.png`}
                          alt={`${tx.metadata?.solver} Logo`}
                          width={30}
                          height={30}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="w-1/6">{getShortAddress(tx.fromAddress)}</p>
                      <p className="w-1/6" style={{ zIndex: 100 }}>
                        <a className="btn" href={`/tx/${tx.id}`}>
                          See
                        </a>
                      </p>
                    </div>
                  </summary>
                  <div className="collapse-content">
                    <hr className="w-full border border-1 border-white/10" />
                    <div className="flex gap-1 justify-around">
                      <div className="flex flex-col gap-1">
                        <TokenDetails
                          token={tx.metadata.data.fromToken}
                          amount={tx.metadata.data.fromAmount}
                          isFrom={true}
                          address={tx.metadata.data.fromAddress}
                          size="sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <TokenDetails
                          token={tx.metadata.data.toToken}
                          amount={tx.metadata.data.toAmount}
                          isFrom={false}
                          address={tx.metadata.data.toAddress}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              ))
            : null}
          {isLoadingTransactions && (
            <span className="loading loading-spinner loading-lg" />
          )}
        </div>
      </section>
    </div>
  );
};
export default DashboardPage;
