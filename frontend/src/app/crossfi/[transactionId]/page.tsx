// @ts-nocheck
"use client";

import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function CrossFiTxn() {
  const { transactionId } = useParams();
  const [txData, setTxData] = useState({
    to: "0x63214cB45714b55e17bc58dd879BdD62EE1B024b",
    data: "0xe8e3370000000000000000000000000083e9a41c38d71f7a06632de275877fca48827870000000000000000000000000c692e6ede21ec911d9e35c6a52bdd31b2d4b44250000000000000000000000000000000000000000000000007ce66c50e284000000000000000000000000000000000000000000000000000078e1d8e7eb2e1127000000000000000000000000000000000000000000000000792730bf19290000000000000000000000000000000000000000000000000000754178cc7b2a1fff000000000000000000000000a339276dcf328b77be4d559658537342b5a0663b0000000000000000000000000000000000000000000000000000000066f8f440",
  });
  const { sendTransaction, data: txHash, isPending } = useSendTransaction();

  // useEffect(() => {
  //   const fetchTransaction = async () => {
  //     try {
  //       const response = await axios.get(`/api/tx/${transactionId}`);
  //       setTxData(response.data.tx);
  //     } catch (error) {
  //       console.error("Error fetching transaction:", error);
  //     }
  //   };

  //   fetchTransaction();
  // }, [transactionId]);

  const executeTransaction = () => {
    if (txData) {
      sendTransaction({ to: txData.to, data: txData.data });
    }
  };

  useWaitForTransactionReceipt({
    hash: txHash,
    onSuccess: () => alert("Transaction Successful!"),
  });

  return (
    <div className="container">
      <h1>Execute Transaction</h1>
      <button
        onClick={executeTransaction}
        disabled={isPending}
        className="btn btn-primary"
      >
        {isPending ? "Executing..." : "Execute Transaction"}
      </button>
    </div>
  );
}
