import { getChainById, logos } from "@/config/costants";
import { getShortAddress } from "@/lib/utils";
import { Token } from "@brian-ai/sdk";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { formatUnits } from "viem";

interface TokenDetailsProps {
  token: Token | undefined;
  amount: string | undefined;
  isFrom: boolean;
  address: string | undefined;
  size: "sm" | "md" | "lg";
}

function formatDecimal(num: number, digits: number = 4): number {
  const factor = Math.pow(10, digits);
  return Math.floor(num * factor) / factor;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({
  token,
  amount,
  isFrom,
  address,
  size,
}) => {
  const intAmount = parseInt(amount || "0");

  let initFormatted = formatUnits(BigInt(intAmount), token?.decimals || 1);
  let amountFormatted = initFormatted;

  if (
    parseFloat(amountFormatted) < 0.001 &&
    parseFloat(amountFormatted) !== 0
  ) {
    amountFormatted = "<0.001";
  } else {
    amountFormatted = formatDecimal(parseFloat(amountFormatted)).toString();
  }

  const dollarAmount = formatDecimal(
    parseFloat(token?.priceUSD || "0") * parseFloat(initFormatted),
  );

  const chain = getChainById(token?.chainId);

  const explorerUrl = chain?.blockExplorers?.default.url;

  const shortAddress = getShortAddress(address || "");

  const chainLogo = logos[token?.chainId || 1];

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2 leading-none">
        <span>{isFrom ? "From:" : "To:"}</span>
        <span>
          <Link href={`${explorerUrl}/address/${address}`} target="_blank">
            <span className="flex gap-1 text-zinc-300 items-center">
              {shortAddress}
              <HiOutlineExternalLink />
            </span>
          </Link>
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex items-end -mr-6">
          <img
            src={token?.logoURI || ""}
            alt="Token Logo"
            className={`${size === "lg" ? "w-[90px] h-[90px]" : size === "md" ? "w-[60px] h-[60px]" : "w-[45px] h-[45px]"} rounded-full`}
          />
          <img
            src={chainLogo}
            alt="Chain Logo"
            className={`${size === "lg" ? "w-[35px] h-[35px] top-[-5px] left-[-25px]" : size === "md" ? "w-[25px] h-[25px] top-[-5px] left-[-25px]" : "w-[20px] h-[20px] top-[-5px] left-[-15px]"} rounded-full relative`}
          />
        </div>
        <div className="flex flex-col">
          <span
            className={`${size === "lg" ? "text-3xl" : "text-xl"} font-bold`}
          >
            {amountFormatted} {token?.symbol}
          </span>
          <span className={`text-${size}`}>${dollarAmount}</span>
          <span>
            <Link
              href={`${explorerUrl}/address/${token?.address}`}
              target="_blank"
            >
              <span className="flex gap-1 text-zinc-300 items-center">
                {token?.name}
                <HiOutlineExternalLink />
              </span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
