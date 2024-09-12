import {
  panel,
  heading,
  button,
  form,
  input,
  text,
  copyable,
  divider,
  spinner,
  row,
} from "@metamask/snaps-sdk";

/**
 * @description createMenuInterface return the first manu interface
 * @returns Promise<string>
 */
export async function createMenuInterface(): Promise<string> {
  return await snap.request({
    method: "snap_createInterface",
    params: {
      ui: panel([
        heading(" Gm, I'm your web3Agent ! How can I help you?"),
        text(
          "I'm your **Web3 assistant** straight inside Metamask. Ask me for a transaction you want to perform or for information!"
        ),
        text(
          "**Stop wasting time** looking for the right Dapp or for Web3 information. Just Ask me!"
        ),
        text("Choose one of the following options:"),
        button({ value: "Transaction", name: "transaction" }),
        button({
          value: "Knowledge Base",
          name: "knowledge-base",
          variant: "secondary",
        }),
        divider(),
        text(
          "(if you find any bugs, please report them to [Kamal](https://x.com/0xkamal7) team 🤯)"
        ),
        text("Powered by 1inch , BrianAI 🧠 & Zerion 🔵"),
      ]),
    },
  });
}

export async function createPreTransactionInterface(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Hey mate, do this before continue 😅"),
        text(
          "Before proceeding with the **transaction** feature, please **connect your wallet**, so I know who is performing transactions."
        ),
        divider(),
        text(
          "You only need to do this **once** for the current account. After the connection, reopen the snap and proceed with the transaction."
        ),
        text("Click the button below to connect your wallet 👇"),
        button({ value: "Connect", name: "connect-wallet" }),
      ]),
    },
  });
}

const BRIAN_MIDDLEWARE_BASE_URL = process.env.BRIAN_MIDDLEWARE_BASE_URL!;

export async function createTransactionInterface(
  id: string,
  connectedAddress?: string
) {
  if (!connectedAddress) {
    await showErrorResult(id, "No connected address", true);
    return;
  }
  const result = await fetch(
    `${BRIAN_MIDDLEWARE_BASE_URL}/zerion/${connectedAddress}/fungible-tokens`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await result.json();
  if (data.status !== "ok") {
    console.error("Brian error:", data);
    await showErrorResult(id, data.error.message, true);
    return;
  }
  const fungible_tokens = data.data;
  console.log("fungible_tokens", fungible_tokens);

  /*
  const fungible_tokens = {
    data: [
      {
        type: "positions",
        id: "base-zksync-era-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "844579688243755982",
            decimals: 18,
            float: 0.844579688243756,
            numeric: "0.844579688243755982",
          },
          value: 2681.9374626274,
          price: 3175.47,
          changes: {
            absolute_1d: 36.12267326618576,
            percent_1d: 1.3652759600344844,
          },
          fungible_info: {
            name: "Ethereum",
            symbol: "ETH",
            icon: {
              url: "https://cdn.zerion.io/eth.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "astar-zkevm",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "aurora",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "base",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "blast",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "ethereum",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "linea",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "manta-pacific",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "mode",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "optimism",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "polygon-zkevm",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "rari",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "redstone",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "scroll",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "zksync-era",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "zora",
                address: null,
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-18T11:15:17Z",
          updated_at_block: 36879482,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/zksync-era",
            },
            data: {
              type: "chains",
              id: "zksync-era",
            },
          },
          fungible: {
            links: {
              related: "https://api.zerion.io/v1/fungibles/eth?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "eth",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x236501327e701692a281934230af0b6be8df3353-ethereum-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "5000000000000000000000",
            decimals: 18,
            float: 5000,
            numeric: "5000.000000000000000000",
          },
          value: 1285.747803,
          price: 0.2571495606,
          changes: {
            absolute_1d: 41.75263300000006,
            percent_1d: 3.3563340121328666,
          },
          fungible_info: {
            name: "Fluence",
            symbol: "FLT",
            icon: {
              url: "https://cdn.zerion.io/f7b40d39-38ac-4518-af3f-d7e3a9fe0839.png",
            },
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "ethereum",
                address: "0x236501327e701692a281934230af0b6be8df3353",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-07-13T23:38:59Z",
          updated_at_block: 20300896,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/ethereum",
            },
            data: {
              type: "chains",
              id: "ethereum",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/f7b40d39-38ac-4518-af3f-d7e3a9fe0839?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "f7b40d39-38ac-4518-af3f-d7e3a9fe0839",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "1000000000",
            decimals: 6,
            float: 1000,
            numeric: "1000.000000",
          },
          value: 999.6379559999999,
          price: 0.9996379559999999,
          changes: {
            absolute_1d: -0.44519199999990633,
            percent_1d: -0.044515498625308236,
          },
          fungible_info: {
            name: "USD Coin",
            symbol: "USDC",
            icon: {
              url: "https://cdn.zerion.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                decimals: 6,
              },
              {
                chain_id: "aurora",
                address: "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",
                decimals: 6,
              },
              {
                chain_id: "avalanche",
                address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
                decimals: 6,
              },
              {
                chain_id: "base",
                address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                decimals: 6,
              },
              {
                chain_id: "binance-smart-chain",
                address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                decimals: 18,
              },
              {
                chain_id: "celo",
                address: "0xceba9300f2b948710d2653dd7b07f33a8b32118c",
                decimals: 6,
              },
              {
                chain_id: "ethereum",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                decimals: 6,
              },
              {
                chain_id: "metis-andromeda",
                address: "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                decimals: 6,
              },
              {
                chain_id: "optimism",
                address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                decimals: 6,
              },
              {
                chain_id: "polygon",
                address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                decimals: 6,
              },
              {
                chain_id: "polygon-zkevm",
                address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
                decimals: 6,
              },
              {
                chain_id: "solana",
                address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                decimals: 6,
              },
              {
                chain_id: "xdai",
                address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
                decimals: 6,
              },
              {
                chain_id: "zksync-era",
                address: "0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4",
                decimals: 6,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-05-25T12:56:10Z",
          updated_at_block: 57374316,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            },
          },
        },
      },
      {
        type: "positions",
        id: "base-ethereum-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "263329962275999628",
            decimals: 18,
            float: 0.2633299622759996,
            numeric: "0.263329962275999628",
          },
          value: 836.1963953085685,
          price: 3175.47,
          changes: {
            absolute_1d: 11.262622486544615,
            percent_1d: 1.3652759600344844,
          },
          fungible_info: {
            name: "Ethereum",
            symbol: "ETH",
            icon: {
              url: "https://cdn.zerion.io/eth.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "astar-zkevm",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "aurora",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "base",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "blast",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "ethereum",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "linea",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "manta-pacific",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "mode",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "optimism",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "polygon-zkevm",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "rari",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "redstone",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "scroll",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "zksync-era",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "zora",
                address: null,
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-07-13T23:38:59Z",
          updated_at_block: 20300896,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/ethereum",
            },
            data: {
              type: "chains",
              id: "ethereum",
            },
          },
          fungible: {
            links: {
              related: "https://api.zerion.io/v1/fungibles/eth?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "eth",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e-zksync-era-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "3419000000000000000000",
            decimals: 18,
            float: 3419,
            numeric: "3419.000000000000000000",
          },
          value: 551.3150034054,
          price: 0.1612503666,
          changes: {
            absolute_1d: 11.7098719114,
            percent_1d: 2.1700816445127113,
          },
          fungible_info: {
            name: "zkSync",
            symbol: "ZK",
            icon: {
              url: "https://cdn.zerion.io/68962b2a-f29f-4104-82cb-6d27bfe51900.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "zksync-era",
                address: "0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-18T11:15:17Z",
          updated_at_block: 36879482,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/zksync-era",
            },
            data: {
              type: "chains",
              id: "zksync-era",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/68962b2a-f29f-4104-82cb-6d27bfe51900?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "68962b2a-f29f-4104-82cb-6d27bfe51900",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48-ethereum-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "528330000",
            decimals: 6,
            float: 528.33,
            numeric: "528.330000",
          },
          value: 528.13872129348,
          price: 0.9996379559999999,
          changes: {
            absolute_1d: -0.23520828935988902,
            percent_1d: -0.044515498625308236,
          },
          fungible_info: {
            name: "USD Coin",
            symbol: "USDC",
            icon: {
              url: "https://cdn.zerion.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                decimals: 6,
              },
              {
                chain_id: "aurora",
                address: "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",
                decimals: 6,
              },
              {
                chain_id: "avalanche",
                address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
                decimals: 6,
              },
              {
                chain_id: "base",
                address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                decimals: 6,
              },
              {
                chain_id: "binance-smart-chain",
                address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                decimals: 18,
              },
              {
                chain_id: "celo",
                address: "0xceba9300f2b948710d2653dd7b07f33a8b32118c",
                decimals: 6,
              },
              {
                chain_id: "ethereum",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                decimals: 6,
              },
              {
                chain_id: "metis-andromeda",
                address: "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                decimals: 6,
              },
              {
                chain_id: "optimism",
                address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                decimals: 6,
              },
              {
                chain_id: "polygon",
                address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                decimals: 6,
              },
              {
                chain_id: "polygon-zkevm",
                address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
                decimals: 6,
              },
              {
                chain_id: "solana",
                address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                decimals: 6,
              },
              {
                chain_id: "xdai",
                address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
                decimals: 6,
              },
              {
                chain_id: "zksync-era",
                address: "0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4",
                decimals: 6,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-03-02T00:22:11Z",
          updated_at_block: 19343862,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/ethereum",
            },
            data: {
              type: "chains",
              id: "ethereum",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x0b38210ea11411557c13457d4da7dc6ea731b88a-ethereum-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "262000000000000000000",
            decimals: 18,
            float: 262,
            numeric: "262.000000000000000000",
          },
          value: 491.91367387680003,
          price: 1.8775331064,
          changes: {
            absolute_1d: -11.963640657199903,
            percent_1d: -2.3743161900956378,
          },
          fungible_info: {
            name: "API3",
            symbol: "API3",
            icon: {
              url: "https://cdn.zerion.io/0x0b38210ea11411557c13457d4da7dc6ea731b88a.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "ethereum",
                address: "0x0b38210ea11411557c13457d4da7dc6ea731b88a",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2023-10-05T10:52:11Z",
          updated_at_block: 18283811,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/ethereum",
            },
            data: {
              type: "chains",
              id: "ethereum",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0x0b38210ea11411557c13457d4da7dc6ea731b88a?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0x0b38210ea11411557c13457d4da7dc6ea731b88a",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "250000000",
            decimals: 6,
            float: 250,
            numeric: "250.000000",
          },
          value: 249.90948899999998,
          price: 0.9996379559999999,
          changes: {
            absolute_1d: -0.11129799999997658,
            percent_1d: -0.044515498625308236,
          },
          fungible_info: {
            name: "USD Coin",
            symbol: "USDC",
            icon: {
              url: "https://cdn.zerion.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                decimals: 6,
              },
              {
                chain_id: "aurora",
                address: "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",
                decimals: 6,
              },
              {
                chain_id: "avalanche",
                address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
                decimals: 6,
              },
              {
                chain_id: "base",
                address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                decimals: 6,
              },
              {
                chain_id: "binance-smart-chain",
                address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                decimals: 18,
              },
              {
                chain_id: "celo",
                address: "0xceba9300f2b948710d2653dd7b07f33a8b32118c",
                decimals: 6,
              },
              {
                chain_id: "ethereum",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                decimals: 6,
              },
              {
                chain_id: "metis-andromeda",
                address: "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                decimals: 6,
              },
              {
                chain_id: "optimism",
                address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                decimals: 6,
              },
              {
                chain_id: "polygon",
                address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                decimals: 6,
              },
              {
                chain_id: "polygon-zkevm",
                address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
                decimals: 6,
              },
              {
                chain_id: "solana",
                address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                decimals: 6,
              },
              {
                chain_id: "xdai",
                address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
                decimals: 6,
              },
              {
                chain_id: "zksync-era",
                address: "0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4",
                decimals: 6,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-05T18:46:57Z",
          updated_at_block: 15411915,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "137413581",
            decimals: 6,
            float: 137.413581,
            numeric: "137.413581",
          },
          value: 137.40310298084566,
          price: 0.9999237483,
          changes: {
            absolute_1d: 0.06849617670440011,
            percent_1d: 0.04987539433676247,
          },
          fungible_info: {
            name: "USD Coin (Polygon)",
            symbol: "USDC.e",
            icon: {
              url: "https://cdn.zerion.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                decimals: 6,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-12T08:38:11Z",
          updated_at_block: 58063642,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/6560e418-690a-47e3-8745-c5e3f9f968fa?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "6560e418-690a-47e3-8745-c5e3f9f968fa",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x6b175474e89094c44da98b954eedeac495271d0f-ethereum-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "100000000000000000000",
            decimals: 18,
            float: 100,
            numeric: "100.000000000000000000",
          },
          value: 99.97967294999998,
          price: 0.9997967294999999,
          changes: {
            absolute_1d: -0.16334795000000213,
            percent_1d: -0.16311466194245394,
          },
          fungible_info: {
            name: "Dai Stablecoin",
            symbol: "DAI",
            icon: {
              url: "https://cdn.zerion.io/0x6b175474e89094c44da98b954eedeac495271d0f.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
                decimals: 18,
              },
              {
                chain_id: "aurora",
                address: "0xe3520349f477a5f6eb06107066048508498a291b",
                decimals: 18,
              },
              {
                chain_id: "avalanche",
                address: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
                decimals: 18,
              },
              {
                chain_id: "base",
                address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
                decimals: 18,
              },
              {
                chain_id: "binance-smart-chain",
                address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
                decimals: 18,
              },
              {
                chain_id: "ethereum",
                address: "0x6b175474e89094c44da98b954eedeac495271d0f",
                decimals: 18,
              },
              {
                chain_id: "metis-andromeda",
                address: "0x4651b38e7ec14bb3db731369bfe5b08f2466bd0a",
                decimals: 18,
              },
              {
                chain_id: "optimism",
                address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
                decimals: 18,
              },
              {
                chain_id: "polygon",
                address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
                decimals: 18,
              },
              {
                chain_id: "polygon-zkevm",
                address: "0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4",
                decimals: 18,
              },
              {
                chain_id: "scroll",
                address: "0xca77eb3fefe3725dc33bccb54edefc3d9f764f97",
                decimals: 18,
              },
              {
                chain_id: "solana",
                address: "EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o",
                decimals: 8,
              },
              {
                chain_id: "xdai",
                address: "0x44fa8e6f47987339850636f88629646662444217",
                decimals: 18,
              },
              {
                chain_id: "zksync-era",
                address: "0x4b9eb6c0b6ea15176bbf62841c6b2a8a398cb656",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2023-10-05T10:52:11Z",
          updated_at_block: 18283811,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/ethereum",
            },
            data: {
              type: "chains",
              id: "ethereum",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0x6b175474e89094c44da98b954eedeac495271d0f?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83-xdai-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "100000000",
            decimals: 6,
            float: 100,
            numeric: "100.000000",
          },
          value: 99.9637956,
          price: 0.9996379559999999,
          changes: {
            absolute_1d: -0.044519199999982106,
            percent_1d: -0.044515498625308236,
          },
          fungible_info: {
            name: "USD Coin",
            symbol: "USDC",
            icon: {
              url: "https://cdn.zerion.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                decimals: 6,
              },
              {
                chain_id: "aurora",
                address: "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",
                decimals: 6,
              },
              {
                chain_id: "avalanche",
                address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
                decimals: 6,
              },
              {
                chain_id: "base",
                address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                decimals: 6,
              },
              {
                chain_id: "binance-smart-chain",
                address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                decimals: 18,
              },
              {
                chain_id: "celo",
                address: "0xceba9300f2b948710d2653dd7b07f33a8b32118c",
                decimals: 6,
              },
              {
                chain_id: "ethereum",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                decimals: 6,
              },
              {
                chain_id: "metis-andromeda",
                address: "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                decimals: 6,
              },
              {
                chain_id: "optimism",
                address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                decimals: 6,
              },
              {
                chain_id: "polygon",
                address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                decimals: 6,
              },
              {
                chain_id: "polygon-zkevm",
                address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
                decimals: 6,
              },
              {
                chain_id: "solana",
                address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                decimals: 6,
              },
              {
                chain_id: "xdai",
                address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
                decimals: 6,
              },
              {
                chain_id: "zksync-era",
                address: "0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4",
                decimals: 6,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2023-11-14T21:04:30Z",
          updated_at_block: 30952873,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/xdai",
            },
            data: {
              type: "chains",
              id: "xdai",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x3c281a39944a2319aa653d81cfd93ca10983d234-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "300000000000000000000000",
            decimals: 18,
            float: 300000,
            numeric: "300000.000000000000000000",
          },
          value: 2.072946816,
          price: 0.00000690982272,
          changes: {
            absolute_1d: 0.0805496160000001,
            percent_1d: 4.04284928728067,
          },
          fungible_info: {
            name: "Build",
            symbol: "BUILD",
            icon: {
              url: "https://cdn.zerion.io/27bae50b-dc54-4c9b-a994-5d3f860ddc06.png",
            },
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0x3c281a39944a2319aa653d81cfd93ca10983d234",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-07-13T23:39:09Z",
          updated_at_block: 17062281,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/27bae50b-dc54-4c9b-a994-5d3f860ddc06?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "27bae50b-dc54-4c9b-a994-5d3f860ddc06",
            },
          },
        },
      },
      {
        type: "positions",
        id: "base-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "215256510259422",
            decimals: 18,
            float: 0.0002152565102594,
            numeric: "0.000215256510259422",
          },
          value: 0.6835405906334867,
          price: 3175.47,
          changes: {
            absolute_1d: 0.009206520943795593,
            percent_1d: 1.3652759600344844,
          },
          fungible_info: {
            name: "Ethereum",
            symbol: "ETH",
            icon: {
              url: "https://cdn.zerion.io/eth.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "astar-zkevm",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "aurora",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "base",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "blast",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "ethereum",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "linea",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "manta-pacific",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "mode",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "optimism",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "polygon-zkevm",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "rari",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "redstone",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "scroll",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "zksync-era",
                address: null,
                decimals: 18,
              },
              {
                chain_id: "zora",
                address: null,
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-21T12:40:51Z",
          updated_at_block: 16092132,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related: "https://api.zerion.io/v1/fungibles/eth?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "eth",
            },
          },
        },
      },
      {
        type: "positions",
        id: "base-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "999633407039361876",
            decimals: 18,
            float: 0.9996334070393619,
            numeric: "0.999633407039361876",
          },
          value: 0.5309344040062774,
          price: 0.5311291121999999,
          changes: {
            absolute_1d: 0.02403015068530978,
            percent_1d: 4.740569945483197,
          },
          fungible_info: {
            name: "Matic Token",
            symbol: "MATIC",
            icon: {
              url: "https://cdn.zerion.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
            },
            flags: {
              verified: true,
            },
            implementations: [
              {
                chain_id: "binance-smart-chain",
                address: "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",
                decimals: 18,
              },
              {
                chain_id: "ethereum",
                address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
                decimals: 18,
              },
              {
                chain_id: "polygon",
                address: "0x0000000000000000000000000000000000001010",
                decimals: 18,
              },
              {
                chain_id: "solana",
                address: "C7NNPWuZCNjZBfW5p6JvGsR8pUdsRpEdP1ZAhnoDwj7h",
                decimals: 8,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-12T08:38:11Z",
          updated_at_block: 58063642,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0xafb89a09d82fbde58f18ac6437b3fc81724e4df6-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "41749295480638764000",
            decimals: 18,
            float: 41.749295480638764,
            numeric: "41.749295480638764000",
          },
          value: 0.1935575075670598,
          price: 0.0046361862,
          changes: {
            absolute_1d: 0.003914881536374065,
            percent_1d: 2.0643468287243616,
          },
          fungible_info: {
            name: "The Doge NFT",
            symbol: "DOG",
            icon: {
              url: "https://cdn.zerion.io/0xbaac2b4491727d78d2b78815144570b9f2fe8899.png",
            },
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "arbitrum",
                address: "0x4425742f1ec8d98779690b5a3a6276db85ddc01a",
                decimals: 18,
              },
              {
                chain_id: "base",
                address: "0xafb89a09d82fbde58f18ac6437b3fc81724e4df6",
                decimals: 18,
              },
              {
                chain_id: "binance-smart-chain",
                address: "0xaa88c603d142c371ea0eac8756123c5805edee03",
                decimals: 18,
              },
              {
                chain_id: "ethereum",
                address: "0xbaac2b4491727d78d2b78815144570b9f2fe8899",
                decimals: 18,
              },
              {
                chain_id: "optimism",
                address: "0x8f69ee043d52161fd29137aedf63f5e70cd504d5",
                decimals: 18,
              },
              {
                chain_id: "polygon",
                address: "0xeee3371b89fc43ea970e908536fcddd975135d8a",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-03-21T17:28:07Z",
          updated_at_block: 12126350,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0xbaac2b4491727d78d2b78815144570b9f2fe8899?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0xbaac2b4491727d78d2b78815144570b9f2fe8899",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x749d57006a1ff4f7ff8cd0a238525b08d85ece33-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "776942069",
            decimals: 7,
            float: 77.6942069,
            numeric: "77.6942069",
          },
          value: 0.01015078237466314,
          price: 0.00013065044074300397,
          changes: {
            absolute_1d: 0.00012399941223810787,
            percent_1d: 1.2366819218366576,
          },
          fungible_info: {
            name: "BASED CLOWN",
            symbol: "BLOWN",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0x749d57006a1ff4f7ff8cd0a238525b08d85ece33",
                decimals: 7,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-07-02T01:40:07Z",
          updated_at_block: 16547510,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/b2418e3f-c2dd-498d-a677-2d529370e743?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "b2418e3f-c2dd-498d-a677-2d529370e743",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0xb56d0839998fd79efcd15c27cf966250aa58d6d3-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "1000000000000000000",
            decimals: 18,
            float: 1,
            numeric: "1.000000000000000000",
          },
          value: 0.0012483439418699998,
          price: 0.0012483439418699998,
          changes: {
            absolute_1d: -0.00013954866993000012,
            percent_1d: -10.054716679341292,
          },
          fungible_info: {
            name: "BASED USA",
            symbol: "USA",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0xb56d0839998fd79efcd15c27cf966250aa58d6d3",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-05-25T12:44:27Z",
          updated_at_block: 14925840,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/c760a4e0-93cd-40cd-baa3-310fccd5dca8?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "c760a4e0-93cd-40cd-baa3-310fccd5dca8",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x653a143b8d15c565c6623d1f168cfbec1056d872-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "100000000",
            decimals: 9,
            float: 0.1,
            numeric: "0.100000000",
          },
          value: 0.000076827956274,
          price: 0.00076827956274,
          changes: {
            absolute_1d: 0.000006467827543999992,
            percent_1d: 9.192461214531944,
          },
          fungible_info: {
            name: "kurbi",
            symbol: "kurbi",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0x653a143b8d15c565c6623d1f168cfbec1056d872",
                decimals: 9,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-18T11:10:01Z",
          updated_at_block: 15959807,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/546036f9-82b3-408f-9c1e-c5280a5cbe16?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "546036f9-82b3-408f-9c1e-c5280a5cbe16",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0xe932099ec1e79246f4655e2c17266f745f20e767-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "42069555",
            decimals: 7,
            float: 4.2069555,
            numeric: "4.2069555",
          },
          value: 0.00005845479220130325,
          price: 0.00001389479689084024,
          changes: {
            absolute_1d: 8.323422725960364e-7,
            percent_1d: 1.444475675063872,
          },
          fungible_info: {
            name: "Nunu is Cat",
            symbol: "NUNU",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0xe932099ec1e79246f4655e2c17266f745f20e767",
                decimals: 7,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-07-13T23:39:09Z",
          updated_at_block: 17062281,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/9330c6fc-a895-45d0-85fa-a9d2a0f199f2?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "9330c6fc-a895-45d0-85fa-a9d2a0f199f2",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x340c070260520ae477b88caa085a33531897145b-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "69000000000000000",
            decimals: 18,
            float: 0.069,
            numeric: "0.069000000000000000",
          },
          value: 0.000014017335905177168,
          price: 0.0002031497957272053,
          changes: {
            absolute_1d: 5.619275363288949e-7,
            percent_1d: 4.176220601597347,
          },
          fungible_info: {
            name: "Shigure UI",
            symbol: "9MM",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0x340c070260520ae477b88caa085a33531897145b",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-28T16:31:23Z",
          updated_at_block: 16401448,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/adaf351c-b96f-4b1e-a2b5-68aa87540355?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "adaf351c-b96f-4b1e-a2b5-68aa87540355",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x523e309bcd48a58a7ffdb16edf357c1b08e5b847-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "100100000000000000000000",
            decimals: 18,
            float: 100100,
            numeric: "100100.000000000000000000",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "JTO",
            symbol: "Visit https://www.jito.farm to claim JTO rewards.",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0x523e309bcd48a58a7ffdb16edf357c1b08e5b847",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-03-02T00:22:24Z",
          updated_at_block: 54156841,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/4ff19a6d-ceb1-490e-907c-f32de996d56a?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "4ff19a6d-ceb1-490e-907c-f32de996d56a",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x99ea2cfeeea395e080070b05c4a38eacfae43393-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "100000000000000000000",
            decimals: 18,
            float: 100,
            numeric: "100.000000000000000000",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "JUAMPI",
            symbol: "JPI",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0x99ea2cfeeea395e080070b05c4a38eacfae43393",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-07-13T23:39:09Z",
          updated_at_block: 59328071,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/0ac2dbf6-38b6-46d8-9676-f40a6788acc2?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "0ac2dbf6-38b6-46d8-9676-f40a6788acc2",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0xfb18511f1590a494360069f3640c27d55c2b5290-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "200000000",
            decimals: 6,
            float: 200,
            numeric: "200.000000",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "Wild Goat Coin",
            symbol: "WGC",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0xfb18511f1590a494360069f3640c27d55c2b5290",
                decimals: 6,
              },
              {
                chain_id: "polygon",
                address: "0x04565fe9aa3ae571ada8e1bebf8282c4e5247b2a",
                decimals: 6,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-18T11:10:03Z",
          updated_at_block: 15959808,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/a39a8c1f-a6be-482a-8bfa-a21d8c9432aa?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "a39a8c1f-a6be-482a-8bfa-a21d8c9432aa",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0xb17d427683e19fc0a46e8dfc71e8a63fb8694ad2-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "8",
            decimals: 0,
            float: 8,
            numeric: "8",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "! BONK",
            symbol: "ACCESS [ETH-BONK.VIP] TO CLAIM YOUR COINS",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0xb17d427683e19fc0a46e8dfc71e8a63fb8694ad2",
                decimals: 0,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-05-24T04:44:00Z",
          updated_at_block: 57322654,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/83ec58de-2a6c-4773-98c0-b1161cab4c66?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "83ec58de-2a6c-4773-98c0-b1161cab4c66",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x54eb1fa9c81a03c8dee8a0cf91a0835c3f15746f-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "120000000000000000000",
            decimals: 18,
            float: 120,
            numeric: "120.000000000000000000",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "AARON Token",
            symbol: "AARON",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0x54eb1fa9c81a03c8dee8a0cf91a0835c3f15746f",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-07-13T23:39:05Z",
          updated_at_block: 59328069,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/b47991f4-f6d3-4373-b09a-d8584d8fe5d3?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "b47991f4-f6d3-4373-b09a-d8584d8fe5d3",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x007c0f2ae0c7187fee8b80db74f2278f1ccb47de-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "220000000000000000",
            decimals: 16,
            float: 22,
            numeric: "22.0000000000000000",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "CoDoge",
            symbol: "CODOGE",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0x007c0f2ae0c7187fee8b80db74f2278f1ccb47de",
                decimals: 16,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-06-18T11:10:04Z",
          updated_at_block: 58308101,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/2a671376-a368-4f13-ac04-6e9fca058e77?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "2a671376-a368-4f13-ac04-6e9fca058e77",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x91b3bb32971bae85854b2b0158aea65033724a6c-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "8",
            decimals: 0,
            float: 8,
            numeric: "8",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "! BONK",
            symbol: "ACCESS [ETH-BONK.VIP] TO FARM YOUR COINS",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0x91b3bb32971bae85854b2b0158aea65033724a6c",
                decimals: 0,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-05-24T04:44:00Z",
          updated_at_block: 57322654,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/e60757f1-6a86-4b2f-9536-6c34a7dd9388?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "e60757f1-6a86-4b2f-9536-6c34a7dd9388",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x6e259376bac4ab281c9d1c89a6c0149d7e8a0d42-base-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "3090000000000000000000",
            decimals: 18,
            float: 3090,
            numeric: "3090.000000000000000000",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "Pawthereum Paws Vote",
            symbol: "PPV",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "base",
                address: "0x6e259376bac4ab281c9d1c89a6c0149d7e8a0d42",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-03-21T17:28:07Z",
          updated_at_block: 12126350,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/base",
            },
            data: {
              type: "chains",
              id: "base",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/35c227e1-c786-4071-bfb1-b229e7a3eebe?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "35c227e1-c786-4071-bfb1-b229e7a3eebe",
            },
          },
        },
      },
      {
        type: "positions",
        id: "0x058d96baa6f9d16853970b333ed993acc0c35add-polygon-asset-asset",
        attributes: {
          parent: null,
          protocol: null,
          name: "Asset",
          position_type: "wallet",
          quantity: {
            int: "1000000000000000000",
            decimals: 18,
            float: 1,
            numeric: "1.000000000000000000",
          },
          value: null,
          price: 0,
          changes: null,
          fungible_info: {
            name: "Staked SPORK",
            symbol: "sSPORK",
            icon: null,
            flags: {
              verified: false,
            },
            implementations: [
              {
                chain_id: "polygon",
                address: "0x058d96baa6f9d16853970b333ed993acc0c35add",
                decimals: 18,
              },
            ],
          },
          flags: {
            displayable: true,
            is_trash: false,
          },
          updated_at: "2024-03-02T00:22:22Z",
          updated_at_block: 54156840,
        },
        relationships: {
          chain: {
            links: {
              related: "https://api.zerion.io/v1/chains/polygon",
            },
            data: {
              type: "chains",
              id: "polygon",
            },
          },
          fungible: {
            links: {
              related:
                "https://api.zerion.io/v1/fungibles/a3bfe6b6-eba6-403c-b7a8-f53a63068c45?currency=usd",
            },
            data: {
              type: "fungibles",
              id: "a3bfe6b6-eba6-403c-b7a8-f53a63068c45",
            },
          },
        },
      },
    ],
  };
  */

  // filter fungible assets that have attributes.fungible_info.flags.verified = true
  const filteredFungibleTokens = fungible_tokens.data.filter(
    (asset: any) =>
      roundPrice(asset.attributes.quantity.float * asset.attributes.price) > 0
  );
  // order the filtered fungible assets by value and then by verified status
  // filteredFungibleTokens.sort((a: any, b: any) => {
  //   if (a.attributes.fungible_info.flags.verified) {
  //     return -1;
  //   } else {
  //     return 1;
  //   }
  // });
  filteredFungibleTokens.sort((a: any, b: any) => {
    return (
      roundPrice(b.attributes.quantity.float * b.attributes.price) -
      roundPrice(a.attributes.quantity.float * a.attributes.price)
    );
  });

  // for each fungible asset, create a card with the asset name, symbol, quantity, and value

  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("What do you want to do? 🧙🏼‍♂️"),
        text(
          "Let me create a transaction for you. Type below the transaction you want to do."
        ),
        form({
          name: "transaction-form",
          children: [
            input({
              label: "Prompt",
              name: "user-prompt",
              placeholder: "Transfer 1 ETH to ...",
            }),
            button({
              value: "Generate",
              buttonType: "submit",
            }),
          ],
        }),
        divider(),
        // heading("Here are some examples:"),
        // text("Transfer 1 ETH to itsmide.eth"),
        // text("Swap 1 ETH to USDC"),
        panel([
          heading(
            "Pssshhh, I've scanned chains for you. Here are your assets 👀"
          ),
          // row for each asset
          ...filteredFungibleTokens.map((asset: any) => {
            return row(
              (asset.attributes.fungible_info.flags.verified ? "✅ " : "⚠️ ") +
                asset.attributes.fungible_info.name,
              text(
                roundTokenAmount(asset.attributes.quantity.numeric) +
                  " " +
                  asset.relationships.chain.data.id +
                  " (" +
                  roundPrice(
                    asset.attributes.quantity.float * asset.attributes.price
                  ) +
                  "$)"
              )
            );
          }),
          filteredFungibleTokens.length === 0
            ? text(
                "Oh huh??? Seems that you have no funds. No problem, every hero started from the beginning. You can go to [MetaIntents page](https://MetaIntents.vercel.app/) to charge new some fresh tokens. "
              )
            : null,
        ]),
      ]),
    },
  });
}

// round a price in dollar to 2 decimal places
function roundPrice(price: number) {
  return Math.round(price * 100) / 100;
}

function roundTokenAmount(amount: string) {
  if (amount.includes(".")) {
    amount = parseFloat(amount).toFixed(4);
  }
  return amount;
}

export async function createKnowledgeBaseInterface(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("What do you want to know? 🔮"),
        text(
          "There are no stupid questions. Ask me anything about Ethereum, DeFi, NFTs, or anything else!"
        ),
        form({
          name: "knowledge-base-form",
          children: [
            input({
              label: "Prompt",
              name: "user-prompt",
              placeholder: "What is UniSwap?",
            }),
            button({
              value: "Ask",
              buttonType: "submit",
            }),
          ],
        }),
      ]),
    },
  });
}

export async function showTransactionGenerationLoader(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Generating a new transaction... 🧠"),
        text(
          "Please wait. This should only take a few seconds. I'm thinking..."
        ),
        spinner(),
      ]),
    },
  });
}

export async function showKnowledgeBaseLoader(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Searching for knowledge... 🔍"),
        text("Please wait. This should only take a few seconds."),
        spinner(),
      ]),
    },
  });
}

export async function showKnowledgeBaseResult(
  id: string,
  result: {
    text: string;
    sourceDocuments: {
      pageContent: string;
      metadata: {
        description: string;
        language: string;
        source: string;
        title: string;
      };
    }[];
  }
) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Here is what I found! 📚"),
        text(result.text),
        divider(),
        heading("Source Documents:"),
        ...result.sourceDocuments.map((doc) => {
          return panel([
            text(
              `[${doc.metadata.title} [${doc.metadata.language}]](${doc.metadata.source})`
            ),
          ]);
        }),
      ]),
    },
  });
}

export async function showTransactionResult(
  id: string,
  link: string,
  description: string
) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("🔒 Okay, your transaction is ready! "),
        text(description),
        divider(),
        text("Please click the button below to proceed."),
        text(`[Fire Transaction 🔥](${link})`),
      ]),
    },
  });
  // await snap.request({
  //   method: "snap_dialog",
  //   params: {
  //     type: "confirmation",
  //     content: panel([
  //       heading("🔒 Okay, your transaction is ready! "),
  //       text(description),
  //       divider(),
  //       text("Please click the button below to proceed."),
  //       text(`[Fire Transaction 🔥](${link})`),
  //     ]),
  //   },
  // });
}

/**
 * @description generate UI interface to show an error status
 * @param id - the interface ID
 * @param errorMessage - the error message to display
 */
export async function showErrorResult(
  id: string,
  errorMessage: string,
  newId: boolean = false
) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("❌ Oops, Something went wrong! ❌"),
        text("An error happened. The error message log is:"),
        copyable(errorMessage),
      ]),
    },
  });
}

/**
 *
 * @param id
 */
export async function cleanMessages(id: string) {
  await snap.request({
    method: "snap_manageState",
    params: {
      operation: "clear",
    },
  });
}
