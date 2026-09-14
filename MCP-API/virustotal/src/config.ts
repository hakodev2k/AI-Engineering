import { z } from 'zod';

const Env = z.object({
  VTAI_TOKEN: z.string().min(1),
  VTAI_MCP_URL: z.string().url().default('https://ai.virustotal.com/mcp'),
  VIRUSTOTAL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(20000),
  VIRUSTOTAL_SUBMIT_SHA256_ALLOWLIST: z.string().optional(),
  VIRUSTOTAL_APPROVAL_SECRET: z.string().min(32).optional()
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = Env.parse(env);
  const url = new URL(parsed.VTAI_MCP_URL);
  if (url.protocol !== 'https:' || url.hostname !== 'ai.virustotal.com') {
    throw new Error('VTAI_MCP_URL must use the trusted https://ai.virustotal.com origin');
  }
  return {
    token: parsed.VTAI_TOKEN,
    mcpUrl: url,
    timeoutMs: parsed.VIRUSTOTAL_TIMEOUT_MS,
    approvalSecret: parsed.VIRUSTOTAL_APPROVAL_SECRET,
    submitAllowlist: new Set((parsed.VIRUSTOTAL_SUBMIT_SHA256_ALLOWLIST ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean))
  };
}
