import { z } from 'zod';

const bool = (fallback: boolean) => z.string().optional().transform(v => v == null ? fallback : v.toLowerCase() === 'true');

const Schema = z.object({
  HONEYBADGER_PERSONAL_AUTH_TOKEN: z.string().min(1),
  HONEYBADGER_REGION: z.enum(['us','eu']).default('us'),
  HONEYBADGER_API_URL: z.string().url().optional(),
  HONEYBADGER_UPSTREAM_COMMAND: z.string().default('docker'),
  HONEYBADGER_UPSTREAM_IMAGE: z.string().default('ghcr.io/honeybadger-io/honeybadger-mcp-server:latest'),
  HONEYBADGER_REQUIRE_WRITE_APPROVAL: bool(true),
  HONEYBADGER_DESTRUCTIVE_ENABLED: bool(false),
  HONEYBADGER_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000)
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env = process.env) {
  const c = Schema.parse(env);
  const apiUrl = c.HONEYBADGER_API_URL ?? (c.HONEYBADGER_REGION === 'eu' ? 'https://eu-app.honeybadger.io' : 'https://app.honeybadger.io');
  const allowed = c.HONEYBADGER_REGION === 'eu' ? 'eu-app.honeybadger.io' : 'app.honeybadger.io';
  const u = new URL(apiUrl);
  if (u.protocol !== 'https:' || u.hostname !== allowed) throw new Error(`HONEYBADGER_API_URL must be https://${allowed}`);
  return {
    token: c.HONEYBADGER_PERSONAL_AUTH_TOKEN,
    region: c.HONEYBADGER_REGION,
    apiUrl: u.origin,
    upstreamCommand: c.HONEYBADGER_UPSTREAM_COMMAND,
    upstreamImage: c.HONEYBADGER_UPSTREAM_IMAGE,
    requireWriteApproval: c.HONEYBADGER_REQUIRE_WRITE_APPROVAL,
    destructiveEnabled: c.HONEYBADGER_DESTRUCTIVE_ENABLED,
    timeoutMs: c.HONEYBADGER_TIMEOUT_MS
  };
}
