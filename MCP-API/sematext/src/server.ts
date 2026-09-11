import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { SematextClient } from './client.js';
import { registerTools } from './tools.js';

export async function main(): Promise<void> {
  const cfg = loadConfig();
  const server = new McpServer({ name: 'sematext-connector', version: '1.0.0' });
  registerTools(server, new SematextClient(cfg), cfg);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { console.error(err instanceof Error ? err.message : String(err)); process.exitCode = 1; });
}
