import { extractChain } from "viem";
import {
  mainnet,
  polygon,
  scroll,
  arbitrum,
  optimism,
  gnosis,
  linea,
  base,
  zkSync,
  aurora,
  fantom,
  avalanche,
  bsc,
  okc,
  taikoKatla,
  goerli,
  holesky,
  Chain,
  lineaSepolia,
} from "wagmi/chains";

const crossfi = {
  id: 4157,
  name: 'CrossFi',
  nativeCurrency: { name: 'XFI', symbol: 'XFI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.ms'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://test.xfiscan.com/' },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
      blockCreated: 16773775,
    },
  },
} as const satisfies Chain

let customMainnet: Chain = {
  ...mainnet,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://eth.blockscout.com",
      apiUrl: "https://eth.blockscout.com/api/v2",
    },
  },
};

let customPolygon: Chain = {
  ...polygon,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://polygon.blockscout.com",
      apiUrl: "https://polygon.blockscout.com/api/v2",
    },
  },
};

let customArbitrum: Chain = {
  ...arbitrum,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://arbitrum.blockscout.com",
      apiUrl: "https://arbitrum.blockscout.com/api/v2",
    },
  },
};

let customOptimism: Chain = {
  ...optimism,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://optimism.blockscout.com",
      apiUrl: "https://optimism.blockscout.com/api/v2",
    },
  },
};

let customGnosis: Chain = {
  ...gnosis,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://gnosis.blockscout.com",
      apiUrl: "https://gnosis.blockscout.com/api/v2",
    },
  },
};

let customLinea: Chain = {
  ...linea,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://explorer.linea.build",
      apiUrl: "https://explorer.linea.build/api/v2",
    },
  },
};

let customBase: Chain = {
  ...base,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://base.blockscout.com",
      apiUrl: "https://base.blockscout.com/api/v2",
    },
  },
};

let customZkSync: Chain = {
  ...zkSync,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://zksync.blockscout.com",
      apiUrl: "https://zksync.blockscout.com/api/v2",
    },
  },
};

let customAurora: Chain = {
  ...aurora,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://explorer.mainnet.aurora.dev",
      apiUrl: "https://explorer.mainnet.aurora.dev/api/v2",
    },
  },
};

let customHolesky: Chain = {
  ...holesky,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://eth-holesky.blockscout.com",
      apiUrl: "https://eth-holesky.blockscout.com/api/v2",
    },
  },
};

let customLineaSepolia: Chain = {
  ...lineaSepolia,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://explorer.sepolia.linea.build",
      apiUrl: "https://explorer.sepolia.linea.build/api/v2",
    },
  },
};

const chains = [
  customMainnet,
  customPolygon,
  scroll,
  customArbitrum,
  customOptimism,
  customGnosis,
  customLinea,
  customBase,
  customZkSync,
  customAurora,
  fantom,
  avalanche,
  bsc,
  okc,
  taikoKatla,
  goerli,
  customHolesky,
  customLineaSepolia,
  crossfi
] as const;

export const getChainById = (id: number | undefined) => {
  if (!id) return undefined;
  const chain = extractChain({
    chains: Object.values(chains),
    id: id,
  });
  return chain;
};

export const getExplorerUrlByChainId = (id: number | undefined) => {
  if (!id) return undefined;
  const chain = getChainById(id);
  return chain?.blockExplorers?.default.url;
};

export const logos: { [key: number]: string } = {
  [customMainnet.id]:
    "https://assets.coingecko.com/asset_platforms/images/279/standard/ethereum.png",
  [customPolygon.id]:
    "https://assets.coingecko.com/asset_platforms/images/15/standard/polygon_pos.png",
  [scroll.id]:
    "https://assets.coingecko.com/asset_platforms/images/153/standard/scroll.jpeg",
  [customArbitrum.id]:
    "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
  [customOptimism.id]:
    "https://assets.coingecko.com/asset_platforms/images/41/standard/optimism.png",
  [customGnosis.id]:
    "https://assets.coingecko.com/asset_platforms/images/11062/standard/Aatar_green_white.png",
  [customLinea.id]:
    "https://assets.coingecko.com/asset_platforms/images/135/standard/linea.jpeg",
  [customBase.id]:
    "https://assets.coingecko.com/asset_platforms/images/131/standard/base-network.png",
  [customZkSync.id]:
    "https://assets.coingecko.com/asset_platforms/images/121/standard/zksync.jpeg",
  [customAurora.id]:
    "https://assets.coingecko.com/asset_platforms/images/53/standard/Aurora-logo-token-darkBG.png",
  [fantom.id]:
    "https://assets.coingecko.com/coins/images/4001/standard/Fantom_round.png",
  [avalanche.id]:
    "https://assets.coingecko.com/asset_platforms/images/12/standard/avalanche.png",
  [bsc.id]:
    "https://assets.coingecko.com/asset_platforms/images/1/standard/bnb_smart_chain.png",
  [okc.id]: "https://s2.coinmarketcap.com/static/img/coins/64x64/3897.png",
  [taikoKatla.id]:
    "https://assets.coingecko.com/coins/images/38058/standard/icon.png",
  [goerli.id]:
    "https://assets.coingecko.com/coins/images/29217/standard/goerli-eth.png",
  [customHolesky.id]:
    "https://assets.coingecko.com/asset_platforms/images/279/standard/ethereum.png",
  [customLineaSepolia.id]:
    "https://assets.coingecko.com/asset_platforms/images/135/standard/linea.jpeg",
  [crossfi.id] : "https://assets.coingecko.com/coins/images/31913/standard/Token-Icon-Stylization-round-bg-XFI.png?1717686175"
};

export { chains };
