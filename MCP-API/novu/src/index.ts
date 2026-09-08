import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './auth/config.js';
import { NovuRestClient } from './client/rest.js';
import { NovuMcpClient } from './transport/upstream-mcp.js';
import { buildTools } from './tools/registry.js';
import { createServer } from './server/server.js';

const cfg = loadConfig();
const rest = new NovuRestClient(cfg);
const upstreamMcp = new NovuMcpClient(cfg);
const server = createServer(cfg, buildTools(upstreamMcp, rest));
await server.connect(new StdioServerTransport());
