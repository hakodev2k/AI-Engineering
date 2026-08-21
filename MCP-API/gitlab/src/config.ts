import { z } from 'zod/v4';

const EnvSchema = z.object({
  GITLAB_BASE_URL: z.string().url().default('https://gitlab.com'),
  GITLAB_TOKEN: z.string().min(1),
  GITLAB_MCP_ACCESS_TOKEN: z.string().min(1).optional(),
  GITLAB_USE_UPSTREAM_MCP: z.enum(['true', 'false']).default('true'),
  GITLAB_REQUIRE_WRITE_APPROVAL: z.enum(['true', 'false']).default('true'),
  GITLAB_HTTP_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  GITLAB_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3)
});

export type ConnectorConfig = {
  baseUrl: string;
  apiBaseUrl: string;
  mcpUrl: string;
  token: string;
  mcpAccessToken?: string;
  useUpstreamMcp: boolean;
  requireWriteApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const parsed = EnvSchema.parse(env);
  const baseUrl = parsed.GITLAB_BASE_URL.replace(/\/$/, '');
  return {
    baseUrl,
    apiBaseUrl: `${baseUrl}/api/v4`,
    mcpUrl: `${baseUrl}/api/v4/mcp`,
    token: parsed.GITLAB_TOKEN,
    mcpAccessToken: parsed.GITLAB_MCP_ACCESS_TOKEN,
    useUpstreamMcp: parsed.GITLAB_USE_UPSTREAM_MCP === 'true',
    requireWriteApproval: parsed.GITLAB_REQUIRE_WRITE_APPROVAL === 'true',
    timeoutMs: parsed.GITLAB_HTTP_TIMEOUT_MS,
    maxRetries: parsed.GITLAB_MAX_RETRIES
  };
}
