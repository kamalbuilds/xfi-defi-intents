"use client";

import { Star } from "@/components/lotties/Star";
import { useRequestSnap } from "@/hooks/useRequestSnap";
import Image from "next/image";

export default function Home() {
  const requestSnap = useRequestSnap();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-8 items-center px-24 py-12 w-fit m-auto glass rounded-3xl glass:border-8">
        <div className="flex gap-4">
          <h2 className="text-6xl font-['Reverie'] mr-[4.75rem]">
            Execute <span className="font-black underline">Defi</span> actions on CrossFi
            with your prompts.
          </h2>
          <Star />
        </div>

        <span className="text-3xl">
          Ask <span className="font-['Reverie']">CrossFiIntents</span> for Information and seamlessly
          send funds, stake , swap, provide liquidity, bridge, and more.
        </span>

        <button className="btn btn-accent" onClick={requestSnap}>
          Connect to the Snap
        </button>

        <Image src="/images/crossfi.png" width={300} height={300} alt="CrossFi Logo" />
      </div>
    </div>
  );
}
