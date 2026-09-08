import { loadConfig } from "./config.js";
import { PorkbunUpstream } from "./upstream.js";
import { runServer } from "./server.js";

const config = loadConfig();
const upstream = new PorkbunUpstream(config);

runServer(config, upstream).catch(async (error) => {
  console.error(String(error?.message || error).replace(/(pk1_|sk1_)[A-Za-z0-9_-]+/g, "$1[REDACTED]"));
  await upstream.close().catch(() => {});
  process.exitCode = 1;
});
