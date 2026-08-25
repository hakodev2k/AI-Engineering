import crypto from 'node:crypto';
import { z } from 'zod';

const boolFromEnv = (value: string | undefined, defaultValue: boolean) => {
  if (value === undefined || value === '') return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const intFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function stableJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`;
}

export const ConfigSchema = z.object({
  orgUrl: z.string().url().refine((value) => value.startsWith('https://'), 'OKTA_ORG_URL must use https').transform((value) => value.replace(/\/$/, '')),
  accessToken: z.string().min(1).optional(),
  apiToken: z.string().min(1).optional(),
  mcpEnabled: z.boolean(),
  mcpCommand: z.string().min(1),
  mcpArgs: z.array(z.string()),
  mcpDirectory: z.string().min(1).optional(),
  mcpClientId: z.string().min(1).optional(),
  mcpScopes: z.string().min(1).optional(),
  mcpPrivateKey: z.string().min(1).optional(),
  mcpKeyId: z.string().min(1).optional(),
  allowRestFallback: z.boolean(),
  approvalSecret: z.string().min(16).optional(),
  timeoutMs: z.number().int().min(1000).max(120000),
  maxRetries: z.number().int().min(0).max(5)
}).superRefine((cfg, ctx) => {
  if (!cfg.mcpEnabled && !cfg.accessToken && !cfg.apiToken) ctx.addIssue({ code: 'custom', message: 'Configure OAuth/API token or enable upstream MCP' });
  if (cfg.mcpEnabled && !cfg.mcpClientId && !cfg.allowRestFallback && !cfg.accessToken && !cfg.apiToken) ctx.addIssue({ code: 'custom', message: 'Upstream MCP needs OKTA_MCP_CLIENT_ID for Okta authentication' });
});

export type OktaConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): OktaConfig {
  return ConfigSchema.parse({
    orgUrl: env.OKTA_ORG_URL,
    accessToken: env.OKTA_ACCESS_TOKEN || undefined,
    apiToken: env.OKTA_API_TOKEN || undefined,
    mcpEnabled: boolFromEnv(env.OKTA_MCP_ENABLED, true),
    mcpCommand: env.OKTA_MCP_COMMAND || 'uv',
    mcpArgs: (env.OKTA_MCP_ARGS || 'run,okta-mcp-server').split(',').map((v) => v.trim()).filter(Boolean),
    mcpDirectory: env.OKTA_MCP_DIRECTORY || undefined,
    mcpClientId: env.OKTA_MCP_CLIENT_ID || undefined,
    mcpScopes: env.OKTA_MCP_SCOPES || undefined,
    mcpPrivateKey: env.OKTA_MCP_PRIVATE_KEY || undefined,
    mcpKeyId: env.OKTA_MCP_KEY_ID || undefined,
    allowRestFallback: boolFromEnv(env.OKTA_ALLOW_REST_FALLBACK, true),
    approvalSecret: env.OKTA_APPROVAL_SECRET || undefined,
    timeoutMs: intFromEnv(env.OKTA_TIMEOUT_MS, 15000),
    maxRetries: intFromEnv(env.OKTA_MAX_RETRIES, 3)
  });
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stableJson(payload)}`).digest('hex');
}
