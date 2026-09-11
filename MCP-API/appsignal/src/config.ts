import { z } from 'zod';

const ConfigSchema = z.object({
  APPSIGNAL_MCP_URL: z.string().url().default('https://appsignal.com/api/mcp'),
  APPSIGNAL_MCP_TOKEN: z.string().min(1),
  APPSIGNAL_TIMEOUT_MS: z.coerce.number().int().positive().max(60000).default(15000),
  APPSIGNAL_WRITE_APPROVAL_REQUIRED: z.enum(['true','false']).default('true')
});

export type Config = {
  mcpUrl: string;
  token: string;
  timeoutMs: number;
  writeApprovalRequired: boolean;
};

export function loadConfig(env = process.env): Config {
  const parsed = ConfigSchema.parse(env);
  const url = new URL(parsed.APPSIGNAL_MCP_URL);
  if (url.protocol !== 'https:' || !['appsignal.com','mcp.appsignal.com'].includes(url.hostname)) {
    throw new Error('APPSIGNAL_MCP_URL must use HTTPS and an official AppSignal hostname');
  }
  return {
    mcpUrl: url.toString(),
    token: parsed.APPSIGNAL_MCP_TOKEN,
    timeoutMs: parsed.APPSIGNAL_TIMEOUT_MS,
    writeApprovalRequired: parsed.APPSIGNAL_WRITE_APPROVAL_REQUIRED === 'true'
  };
}
