import type { Metadata } from "next";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "MetaIntents",
  description: "Executing Intents straight from your wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={`background--custom min-h-screen`}>
        <Web3ModalProvider initialState={initialState}>
          <main className="dark flex flex-col justify-between p-6 h-full">
            <div className="flex flex-col items-center gap-14">
              <Header />
              {children}
            </div>
            <Footer />
          </main>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
