import type { SnapConfig } from "@metamask/snaps-cli";
import { resolve } from "path";
import * as dotenv from "dotenv";
dotenv.config();

const config: SnapConfig = {
  bundler: "webpack",
  input: resolve(__dirname, "src/index.ts"),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
  },
  stats: {
    builtIns: false,
  },
  environment: {
    BRIAN_MIDDLEWARE_BASE_URL: process.env.BRIAN_MIDDLEWARE_BASE_URL,
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
  },
};

export default config;
