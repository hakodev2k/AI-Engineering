import { z } from 'zod';

const env = z.object({
  PORT_CLIENT_ID: z.string().min(1),
  PORT_CLIENT_SECRET: z.string().min(1),
  PORT_MCP_URL: z.string().url().default('https://mcp.port.io/v1'),
  PORT_API_URL: z.string().url().default('https://api.port.io/v1'),
  PORT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  PORT_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  PORT_WRITE_APPROVED: z.enum(['true','false']).default('false')
});

export type Config = {
  clientId: string; clientSecret: string; mcpUrl: string; apiUrl: string;
  timeoutMs: number; maxRetries: number; writeApproved: boolean;
};

export function loadConfig(source: NodeJS.ProcessEnv = process.env): Config {
  const v = env.parse(source);
  return {
    clientId: v.PORT_CLIENT_ID,
    clientSecret: v.PORT_CLIENT_SECRET,
    mcpUrl: v.PORT_MCP_URL.replace(/\/$/, ''),
    apiUrl: v.PORT_API_URL.replace(/\/$/, ''),
    timeoutMs: v.PORT_TIMEOUT_MS,
    maxRetries: v.PORT_MAX_RETRIES,
    writeApproved: v.PORT_WRITE_APPROVED === 'true'
  };
}
