import { z } from 'zod';

const envSchema = z.object({
  CALENDLY_API_TOKEN: z.string().min(1).optional(),
  CALENDLY_API_BASE_URL: z.string().url().default('https://api.calendly.com'),
  CALENDLY_MCP_URL: z.string().url().default('https://mcp.calendly.com/'),
  CALENDLY_MCP_ACCESS_TOKEN: z.string().min(1).optional(),
  CALENDLY_TRANSPORT: z.enum(['auto', 'mcp', 'rest']).default('auto'),
  CALENDLY_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  CALENDLY_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  CALENDLY_REQUIRE_WRITE_APPROVAL: z.enum(['true', 'false']).default('true').transform(v => v === 'true'),
  CALENDLY_APPROVAL_SECRET: z.string().min(16).optional()
});

export type CalendlyConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): CalendlyConfig {
  const cfg = envSchema.parse(env);
  if (cfg.CALENDLY_TRANSPORT === 'mcp' && !cfg.CALENDLY_MCP_ACCESS_TOKEN) {
    throw new Error('CALENDLY_MCP_ACCESS_TOKEN is required when CALENDLY_TRANSPORT=mcp');
  }
  if (cfg.CALENDLY_TRANSPORT === 'rest' && !cfg.CALENDLY_API_TOKEN) {
    throw new Error('CALENDLY_API_TOKEN is required when CALENDLY_TRANSPORT=rest');
  }
  if (cfg.CALENDLY_REQUIRE_WRITE_APPROVAL && !cfg.CALENDLY_APPROVAL_SECRET) {
    throw new Error('CALENDLY_APPROVAL_SECRET is required when write approval is enabled');
  }
  if (cfg.CALENDLY_TRANSPORT === 'auto' && !cfg.CALENDLY_MCP_ACCESS_TOKEN && !cfg.CALENDLY_API_TOKEN) {
    throw new Error('Configure CALENDLY_MCP_ACCESS_TOKEN or CALENDLY_API_TOKEN');
  }
  return cfg;
}
