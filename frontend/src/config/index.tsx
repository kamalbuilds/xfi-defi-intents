// config/index.tsx

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { chains } from "./costants";

// Your WalletConnect Cloud project ID
export const projectId = "af0e8d55d6b6f941fe0941babf3a38be";

// Create a metadata object
const metadata = {
  name: "MetaAI",
  description: "AppKit Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  auth: {
    email: true, // default to true
    socials: ["google", "x", "github", "discord", "apple"],
    showWallets: true, // default to true
    walletFeatures: true, // default to true
  },
});
