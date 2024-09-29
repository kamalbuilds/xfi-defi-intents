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
  NodeType,
} from "@metamask/snaps-sdk";

/**
 * @description createMenuInterface return the first manu interface
 * @returns Promise<string>
 */
export async function createMenuInterface(): Promise<string> {

  console.log("kamal lets work >>>>")
  return await snap.request({
    method: "snap_createInterface",
    params: {
      ui: panel([
        heading(" Gm, I'm your XFi Defi Agent ! Ask me anything about XFi?"),
        text(
          "I'm your **CrossFi Defi assistant** straight inside Metamask. Ask me for a transaction you want to perform or for information!"
        ),
        text(
          "**Stop wasting time** looking for the defi apps for doing txns or for CrossFi information. Just Ask me!"
        ),
        text("Choose one of the following options:"),
        button({ value: "Transaction", name: "transaction" }),
        button({
          value: "Ask about CrossFi",
          name: "knowledge-base",
          variant: "secondary",
        }),
        button({
          value: "Stake Tokens",
          name: "staking",
          variant: "secondary",
        }),
        divider(),
        text(
          "(if you find any bugs, please report them to [Kamal](https://x.com/0xkamal7) 🤠)"
        ),
        text("Powered by CrossFinance , BrianAI 🧠"),
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
        heading("Hey user, please do this before continuing 😅"),
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


export async function createTransactionInterface(
  id: string,
  connectedAddress?: string
) {
  if (!connectedAddress) {
    await showErrorResult(id, "No connected address", true);
    return;
  };

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


export async function createStakingInterface(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Stake Your Tokens"),
        form({
          name: "staking-form",
          children: [
            input ({
              label: "Amount",
              name: "amount",
              placeholder: "0.0",
              inputType: "number",
            }),
            input({
              label: "Token",
              name: "token",
              placeholder: "lPXFI",
            }),
            button({
              value: "Stake",
              buttonType: "submit",
            }),
          ],
          
        }),
      ]),
    },
  });
}



export async function createKnowledgeBaseInterface(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("What do you want to know? 🔮"),
        text(
          "Ask me anything about CrossFi , Ethereum, DeFi on CrossFi, NFTs, or anything else!"
        ),
        form({
          name: "knowledge-base-form",
          children: [
            input({
              label: "Prompt",
              name: "user-prompt",
              placeholder: "What is XFI?",
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
        heading("Generating your transaction... 🧠"),
        text(
          "Please wait. This should only takes a few seconds. I'm cooking 🧑🏻‍🍳🧑🏻‍🍳..."
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
        heading("Searching .... 🔍"),
        text("Please wait. This should only take a few seconds."),
        spinner(),
      ]),
    },
  });
}

export async function showKnowledgeBaseResult(
  id: string,
  result: {
    answer?: string;
    context: {
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
        heading("Dear User, here is what I found! 🦊"),
        text(result.answer || "I couldn't find an answer to your question."),
        divider(),
        heading("Source Documents:"),
        ...result.context.map((doc) => {
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
        text(`[Launch Transaction 🚀](${link})`),
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
