import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer } from "./server/server.js";

const { server, client } = buildServer();
const transport = new StdioServerTransport();

const shutdown = async () => {
  try { await client.close(); } finally { process.exit(0); }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await server.connect(transport);
