"use client";

import { useParams } from "next/navigation";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSwitchChain,
  useReadContract,
  useBalance,
} from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import { TransactionData } from "@brian-ai/sdk";
import Image from "next/image";
import { TokenDetails } from "@/components/TokenDetails";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdSwapHoriz } from "react-icons/md";
import { abiNftLinea } from "./nft-abi-linea";
import { walletConnectProvider } from "@/context";
import { getExplorerUrlByChainId } from "@/config/costants";
import confetti from "canvas-confetti";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { HiArrowLongRight } from "react-icons/hi2";
import { erc20Abi } from "viem";

interface TransactionDataExtended extends TransactionData {
  amountToApprove: string;
}

interface Metadata {
  action: string;
  data: TransactionDataExtended;
  solver: string;
  type: string;
}

export interface GetTxResult {
  id: string;
  metadata: Metadata;
  fromAddress: string;
  txHash: string | null;
}

function extractENSDomain(input: string): string | null {
  const regex = /\b\w+\.eth\b/;
  const match = input.match(regex);
  return match ? match[0] : null;
}

export default function Tx() {
  const [txMetadata, setTxMetadata] = useState<Metadata | null>(null);
  const { address, status } = useAccount();
  const [askedToConnect, setAskedToConnect] = useState(false);

  const {
    data: hashApproval,
    isPending: isPendingApproval,
    writeContract: writeContractApproval,
    error: errorApproval,
  } = useWriteContract();
  errorApproval && console.log("error approval", errorApproval);

  const {
    data: hashMint,
    isPending: isPendingMint,
    writeContract: writeContractMint,
    error: errorMint,
  } = useWriteContract();
  errorMint && console.log("error mint", errorMint);

  const { transactionId } = useParams();

  const getTxData = async () => {
    const data = await axios
      .get(`/api/tx/${transactionId}`)
      .then((res) => res.data);
    const getTxResult: GetTxResult = data.tx.data;
    setTxMetadata(getTxResult.metadata);
  };

  const {
    sendTransaction,
    isPending: isPendingTx,
    data: hashTx,
  } = useSendTransaction();

  const { isLoading: isLoadingApproval, isSuccess: isSuccessApproved } =
    useWaitForTransactionReceipt({
      hash: hashApproval,
    });

  const { isLoading: isLoadingTx, isSuccess: isSuccessTx } =
    useWaitForTransactionReceipt({
      hash: hashTx,
    });

  const { isLoading: isLoadingMint, isSuccess: isSuccessMint } =
    useWaitForTransactionReceipt({ hash: hashMint });

  useEffect(() => {
    getTxData();
  }, []);

  const tokenAddress = txMetadata?.data.fromToken?.address || "0x";
  const spender = txMetadata?.data.toAddress || "0x";

  const {
    data: result,
    isLoading: isLoadingBalance,
    error: errorBalance,
  } = useBalance(
    tokenAddress !== "0x0000000000000000000000000000000000000000"
      ? {
          address: address || "0x",
          token: tokenAddress,
        }
      : {
          address: address || "0x",
        },
  );

  const notEnoughBalance =
    result !== undefined &&
    BigInt(txMetadata?.data.fromAmount || "0") > result.value;

  console.log("✅ balance", result);

  console.log("tokenAddress", tokenAddress, "spender", spender);

  const {
    data: allowanceResult,
    isLoading: isLoadingAllowance,
    error: errorAllowance,
  } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [address || "0x", spender],
    query: {
      refetchInterval: 1000,
    },
  });

  console.log("allowanceResult", allowanceResult);

  const amountToApprove = BigInt(txMetadata?.data.amountToApprove || "0");
  const fromAmount = BigInt(txMetadata?.data.fromAmount || "0");

  console.log("amountToApprove", amountToApprove, "fromAmount", fromAmount);

  const enoughAllowance =
    amountToApprove === BigInt(0) ||
    (allowanceResult !== undefined && fromAmount <= allowanceResult);

  console.log("enoughAllowance", enoughAllowance);

  const approve = async () => {
    try {
      writeContractApproval({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, fromAmount],
      });
    } catch (e) {
      console.error("error approval", e);
    }
  };

  const mintNft = async () => {
    // get a random uint tokenId from 2 to 100
    const tokenId = Math.floor(Math.random() * 99) + 2;
    console.log("minting nft", tokenId);
    try {
      writeContractMint({
        address: "0x0d677fd109a1be0f32028c43aea4a1481a015402", // linea sepolia nft
        // address: "0xe9c31ab9a6dbd39aad1bd82d3713084742e38197", // linea mainnet nft
        abi: abiNftLinea,
        functionName: "safeMint",
        args: [
          address,
          BigInt(tokenId),
          "https://ipfs.io/ipfs/Qmbks95fQRb3zsnsWSHVFAHd6iLBGuM8otSJyVjzXLBNgM",
        ],
      });
    } catch (e) {
      console.error("error mint", e);
    }
    console.log("minted", hashMint);
  };

  const chainId = walletConnectProvider.getState().selectedNetworkId;
  const txChainId = txMetadata?.data.fromChainId;
  const wrongChain = chainId && txChainId && chainId !== txChainId;

  const { isPending: isSwitchChainPending, switchChain } = useSwitchChain();

  useEffect(() => {
    if (wrongChain) {
      switchChain({ chainId: txChainId });
    }
  }, [chainId, txChainId]);

  const explorerUrl = getExplorerUrlByChainId(txChainId);

  useEffect(() => {
    if (isSuccessTx) {
      confetti({
        particleCount: 200,
        spread: 70,
      });
    }
  }, [isSuccessTx]);

  useEffect(() => {
    if (isSuccessMint) {
      confetti({
        particleCount: 200,
        spread: 70,
      });
    }
  }, [isSuccessMint]);

  const { open } = useWeb3Modal();

  const isDisconnected = status === "disconnected";

  useEffect(() => {
    setTimeout(() => {
      if (isDisconnected && !askedToConnect) {
        open();
        setAskedToConnect(true);
      }
    }, 1500);
  }, [isDisconnected]);

  console.log("txMetadata", txMetadata);

  const isEnsAction = txMetadata?.action === "ENS Registration";

  const {
    sendTransaction: sendTransactionEnsOne,
    isPending: isPendingEnsOne,
    data: hashEnsOne,
  } = useSendTransaction();

  const { isLoading: isLoadingEnsOne, isSuccess: isSuccessEnsOne } =
    useWaitForTransactionReceipt({
      hash: hashEnsOne,
    });

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isSuccessEnsOne) {
      setStep(1);
    }
  }, [isSuccessEnsOne]);

  const {
    sendTransaction: sendTransactionEnsTwo,
    isPending: isPendingEnsTwo,
    data: hashEnsTwo,
  } = useSendTransaction();

  const { isLoading: isLoadingEnsTwo, isSuccess: isSuccessEnsTwo } =
    useWaitForTransactionReceipt({
      hash: hashEnsTwo,
    });

  useEffect(() => {
    if (isSuccessEnsTwo) {
      setStep(2);
    }
  }, [isSuccessEnsTwo]);

  const ensDomain = extractENSDomain(txMetadata?.data.description || "");

  const [oneMinuteCounter, setOneMinuteCounter] = useState(60);

  useEffect(() => {
    if (step === 1 && oneMinuteCounter >= 0) {
      const interval = setInterval(() => {
        setOneMinuteCounter((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  return txMetadata ? (
    <div className="flex flex-col gap-12 items-center w-[60rem] glass rounded-[2.5rem] p-10">
      {/* HEADER */}
      <div className="flex w-full justify-between">
        <span className="text-[2.5rem] leading-none">
          {txMetadata?.action.charAt(0).toUpperCase() +
            txMetadata?.action.slice(1)}
        </span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg leading-none text-zinc-300">Solver</span>
          <div className="flex gap-1">
            <span className="text-2xl leading-none">{txMetadata?.solver}</span>
            <Image
              src={`/images/${txMetadata?.solver.toLowerCase()}_logo.png`}
              alt={`${txMetadata?.solver} Logo`}
              width={30}
              height={30}
              className="w-6 h-6"
            />
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-4 items-start w-full">
        {/* NOT ENOUGH BALANCE */}
        {notEnoughBalance && (
          <div className="flex flex-col gap-4 items-start w-full">
            <span>
              ⚠️ You don't have enough balance to perform this transaction!
            </span>
          </div>
        )}
        {isEnsAction ? (
          <div className="flex flex-col w-full items-center gap-12">
            <span className="max-w-[40rem] text-lg text-center">
              You're going to register the ENS domain{" "}
              <span className="text-accent">{ensDomain}</span>. For this, you
              need first to bid, then wait for 1 minute, and if no one else
              bids, you can register it.
            </span>
            {step === 1 && oneMinuteCounter > 0 && (
              <span className="text-lg text-center">
                Please wait for{" "}
                <span className="text-accent">{oneMinuteCounter}</span> seconds
                to complete the registration.
              </span>
            )}
            <ul className="steps w-full">
              <li className="step step-accent">Bid</li>
              <li className={`step ${step > 0 && "step-accent"}`}>Register</li>
              <li className={`step ${step > 1 && "step-accent"}`}>Completed</li>
            </ul>
            {step !== 2 ? (
              <button
                className="btn btn-accent w-fit"
                onClick={() => {
                  wrongChain
                    ? switchChain({ chainId: txChainId })
                    : step === 0
                      ? sendTransactionEnsOne(txMetadata.data.steps?.[0] as any)
                      : sendTransactionEnsTwo(
                          txMetadata.data.steps?.[1] as any,
                        );
                }}
                disabled={
                  notEnoughBalance ||
                  isDisconnected ||
                  isSwitchChainPending ||
                  (step === 0 ? isPendingEnsOne : isPendingEnsTwo) ||
                  (step === 0 ? isLoadingEnsOne : isLoadingEnsTwo) ||
                  (step === 1 && oneMinuteCounter > 0)
                }
              >
                <span className="text-xl">
                  {isDisconnected
                    ? "Connect Wallet"
                    : wrongChain
                      ? "Switch Chain"
                      : step === 0
                        ? `Bid ${ensDomain}`
                        : `Register ${ensDomain}`}
                </span>
                {((step === 0 ? isPendingEnsOne : isPendingEnsTwo) ||
                  (step === 0 ? isLoadingEnsOne : isLoadingEnsTwo)) && (
                  <span className="loading loading-spinner loading-xs" />
                )}
              </button>
            ) : (
              <div className="flex flex-col gap-4 items-center">
                <span className="icon icon-check text-2xl">
                  ENS{" "}
                  <a href={`${explorerUrl}/tx/${hashEnsTwo}`} target="_blank">
                    Registered
                  </a>
                  !
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[40%_20%_40%] gap-0 justify-items-center items-center w-full p-4 py-8 border-[1px] border-[#ffffff21] rounded-[1.5rem]">
            <TokenDetails
              token={txMetadata.data.fromToken}
              amount={txMetadata.data.fromAmount}
              isFrom={true}
              address={txMetadata.data.fromAddress}
              size="lg"
            />
            <div className="col-span-1 w-fit">
              {txMetadata?.action === "transfer" && (
                <HiArrowLongRight color="white" className="w-[60px] h-[60px]" />
              )}
              {txMetadata?.action === "swap" && (
                <MdSwapHoriz color="white" className="w-[80px] h-[80px]" />
              )}
              {txMetadata?.action === "bridge" && (
                <FaArrowRightLong color="white" className="w-[60px] h-[60px]" />
              )}
            </div>
            <TokenDetails
              token={txMetadata?.data.toToken}
              amount={txMetadata.data.toAmount}
              isFrom={false}
              address={txMetadata.data.toAddress}
              size="lg"
            />
          </div>
        )}
      </div>

      {!isEnsAction && !isSuccessTx && (
        <div className="flex gap-4">
          {!notEnoughBalance && amountToApprove && (
            <button
              className="btn btn-primary"
              onClick={approve}
              disabled={
                enoughAllowance ||
                isDisconnected ||
                isSwitchChainPending ||
                isPendingApproval ||
                isLoadingApproval ||
                isLoadingAllowance
              }
            >
              <span className="text-xl">Approve</span>
              {!enoughAllowance && (isPendingApproval || isLoadingApproval) && (
                <span className="loading loading-spinner loading-xs" />
              )}
            </button>
          )}
          <button
            className="btn btn-accent"
            onClick={() => {
              wrongChain
                ? switchChain({ chainId: txChainId })
                : sendTransaction(txMetadata.data.steps?.[0] as any);
            }}
            disabled={
              notEnoughBalance ||
              !enoughAllowance ||
              isDisconnected ||
              isSwitchChainPending ||
              isPendingTx ||
              isLoadingTx
            }
          >
            <span className="text-xl">
              {isDisconnected
                ? "Connect Wallet"
                : wrongChain
                  ? "Switch Chain"
                  : "Confirm"}
            </span>
            {(isPendingTx || isLoadingTx) && (
              <span className="loading loading-spinner loading-xs" />
            )}
          </button>
        </div>
      )}
      {isSuccessTx && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">Transaction Successful 🤝</span>
          <span className="text-xl">
            View more details on{" "}
            <a href={`${explorerUrl}/tx/${hashTx}`} target="_blank">
              Blockscout
            </a>
          </span>
        </div>
      )}
      {isSuccessTx && (
        <div className="flex flex-col gap-4 items-center">
          {!isSuccessMint && (
            <>
              <h1 className="text-2xl">
                Now you are an OG user of MetaIntents with Brian
              </h1>
              <button
                className="btn btn-accent"
                onClick={mintNft}
                disabled={
                  isDisconnected ||
                  isSwitchChainPending ||
                  isPendingMint ||
                  isLoadingMint
                }
              >
                <span className="text-xl">Mint your NFT</span>
                {(isPendingMint || isLoadingMint) && (
                  <span className="loading loading-spinner loading-xs" />
                )}
              </button>
            </>
          )}
          {isSuccessMint && (
            <div className="flex flex-col gap-4 items-center">
              <span className="icon icon-check text-2xl">
                NFT{" "}
                <a href={`${explorerUrl}/tx/${hashMint}`} target="_blank">
                  Minted
                </a>
                !
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <span className="loading loading-spinner loading-lg" />
  );
}
