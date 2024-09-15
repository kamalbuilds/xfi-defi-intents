import {
  panel,
  text,
  UserInputEventType,
  OnHomePageHandler,
  OnRpcRequestHandler,
  OnUserInputHandler,
} from "@metamask/snaps-sdk";


import {
  createKnowledgeBaseInterface,
  createMenuInterface,
  createPreTransactionInterface,
  createTransactionInterface,
  showErrorResult,
  showKnowledgeBaseLoader,
  showKnowledgeBaseResult,
  showTransactionGenerationLoader,
  showTransactionResult,
} from "./ui";

const BRIAN_MIDDLEWARE_BASE_URL = process.env.BRIAN_MIDDLEWARE_BASE_URL!;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL!;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case "hello":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: panel([
            text(`Hello, **${origin}**!`),
            text("This custom confirmation is just for display purposes."),
            text(
              "But you can edit the snap source code to make it do something, if you want to!"
            ),
          ]),
        },
      });
    default:
      throw new Error("Method not found.");
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  const interfaceId = await createMenuInterface();
  console.log("Homepage Interface ID:", interfaceId);
  return { id: interfaceId };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  console.log("Interface ID:", id);
  console.log("User input event:", JSON.stringify(event));
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case "transaction":
        // check if the user has already connected the current account
        console.log("get snap state");
        const snapState = await snap.request({
          method: "snap_manageState",
          params: { operation: "get" },
        });
        console.log("snap state", snapState);
        if (snapState && snapState.alreadyConnected) {
          await createTransactionInterface(
            id,
            snapState.connectedAddress as string
          );
        } else {
          await createPreTransactionInterface(id);
        }
        break;
      case "knowledge-base":
        console.log("Knowledge base clicked 🟡");
        await createKnowledgeBaseInterface(id);
        break;

      case "error-message":
        await showErrorResult(id, "ops");

      default:
        break;
    }
  }

  if (
    event.type === UserInputEventType.ButtonClickEvent &&
    event.name === "connect-wallet"
  ) {
    console.log("Connection form submitted 🔵");

    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      console.log("🟢 Accounts:", accounts);
      await snap.request({
        method: "snap_manageState",
        params: {
          operation: "update",
          newState: { alreadyConnected: true, connectedAddress: accounts[0]! },
        },
      });
      await createTransactionInterface(id);
    } catch (error) {
      console.error("Connection error:", error);
      await showErrorResult(id, "Connection error");
    }
  }

  /** Handle Transaction Form */
  if (
    event.type === UserInputEventType.FormSubmitEvent &&
    event.name === "transaction-form"
  ) {
    console.log("Transaction form submitted 🔵");

    const { "user-prompt": userPrompt } = event.value;

    if (!userPrompt) {
      console.error("User prompt is empty");
      await showErrorResult(id, "Your prompt is empty");
      return;
    }

    // brian call
    try {
      await showTransactionGenerationLoader(id);
      console.log("calling brian with", BRIAN_MIDDLEWARE_BASE_URL, userPrompt);

      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      console.log("🟢 Accounts:", accounts);
      const result = await fetch(
        `${BRIAN_MIDDLEWARE_BASE_URL}/brian/transaction`,
        {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userPrompt,
            address: accounts[0],
          }),
        }
      );

      
      const data = await result.json();
      if (data.status !== "ok") {
        console.error("Brian error:", data);
        await showErrorResult(id, data.error.message);
        return;
      }
      console.log("Brian response:", JSON.stringify(data));
      console.log(
        "URL for SUBMITTING THE TX:",
        `${FRONTEND_BASE_URL}/tx/${data.id}`
      );
      await showTransactionResult(
        id,
        `${FRONTEND_BASE_URL}/tx/${data.id}`,
        data.data.data.description
      );
    } catch (error) {
      console.log("Brian error:", error);
      await showErrorResult(id, "Generic Transaction error");
    }
  }

  /** Handle Knowledge Base Form */
  if (
    event.type === UserInputEventType.FormSubmitEvent &&
    event.name === "knowledge-base-form"
  ) {
    console.log("Knowledge base form submitted 🟡");
    const { "user-prompt": userPrompt } = event.value;

    if (!userPrompt) {
      console.error("Knowledge base prompt is empty");
      await showErrorResult(
        id,
        "Your prompt is empty! I can't help you if you don't tell me what you want to know. 🤷🏼‍♂️"
      );
      return;
    }

    // brian call
    debugger
    try {
      await showKnowledgeBaseLoader(id);
      console.log("calling brian with", BRIAN_MIDDLEWARE_BASE_URL, userPrompt);
    
      const result = await fetch(
        `${BRIAN_MIDDLEWARE_BASE_URL}/brian/knowledge-base`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userPrompt,
          }),
        }
      );
      const data = await result.json();
      console.log("Brian response:", JSON.stringify(data));
      await showKnowledgeBaseResult(id, data.data);
    } catch (error) {
      console.error("Brian error:", error);
      await showErrorResult(id, "uhoh we got error");
    }
  }
};
