import { z } from 'zod';

const envSchema = z.object({
  POSTMAN_API_KEY: z.string().min(1),
  POSTMAN_API_BASE_URL: z.string().url().default('https://api.getpostman.com'),
  POSTMAN_MCP_URL: z.string().url().default('https://mcp.postman.com/minimal'),
  POSTMAN_MCP_MODE: z.enum(['minimal', 'code', 'full', 'learn']).default('minimal'),
  POSTMAN_APPROVAL_SECRET: z.string().min(16).optional(),
  POSTMAN_WRITE_APPROVAL: z.enum(['true', 'false']).default('true'),
  POSTMAN_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  POSTMAN_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3)
});

export type Config = {
  apiKey: string;
  apiBaseUrl: string;
  mcpUrl: string;
  mcpMode: 'minimal' | 'code' | 'full' | 'learn';
  approvalSecret?: string;
  writeApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.parse(env);
  return {
    apiKey: parsed.POSTMAN_API_KEY,
    apiBaseUrl: parsed.POSTMAN_API_BASE_URL.replace(/\/$/, ''),
    mcpUrl: parsed.POSTMAN_MCP_URL,
    mcpMode: parsed.POSTMAN_MCP_MODE,
    approvalSecret: parsed.POSTMAN_APPROVAL_SECRET,
    writeApproval: parsed.POSTMAN_WRITE_APPROVAL === 'true',
    timeoutMs: parsed.POSTMAN_TIMEOUT_MS,
    maxRetries: parsed.POSTMAN_MAX_RETRIES
  };
}
