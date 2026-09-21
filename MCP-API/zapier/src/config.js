import { z } from 'zod';

const schema = z.object({
  ZAPIER_MCP_URL: z.string().url().refine(v => v.startsWith('https://'), 'HTTPS is required'),
  ZAPIER_MCP_ALLOWED_TOOLS: z.string().min(1),
  ZAPIER_MCP_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(20000),
  ZAPIER_APPROVAL_SECRET: z.string().min(16)
});

export function loadConfig(env = process.env) {
  const value = schema.parse(env);
  return {
    endpoint: value.ZAPIER_MCP_URL,
    allowedTools: new Set(value.ZAPIER_MCP_ALLOWED_TOOLS.split(',').map(x => x.trim()).filter(Boolean)),
    timeoutMs: value.ZAPIER_MCP_TIMEOUT_MS,
    approvalSecret: value.ZAPIER_APPROVAL_SECRET
  };
}
