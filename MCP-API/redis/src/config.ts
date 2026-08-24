export interface RedisConnectorConfig {
  redisUrl: string;
  allowedKeyPrefixes: string[];
  approvalSecret?: string;
  allowDestructive: boolean;
  destructiveApprovalSecret?: string;
  upstreamCommand: string;
  upstreamArgs: string[];
  upstreamTimeoutMs: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): RedisConnectorConfig {
  if (!env.REDIS_URL) throw new Error('REDIS_URL is required');
  const timeout = Number(env.REDIS_UPSTREAM_TIMEOUT_MS ?? 15000);
  if (!Number.isInteger(timeout) || timeout < 1000 || timeout > 120000) {
    throw new Error('REDIS_UPSTREAM_TIMEOUT_MS must be an integer between 1000 and 120000');
  }
  return {
    redisUrl: env.REDIS_URL,
    allowedKeyPrefixes: (env.REDIS_ALLOWED_KEY_PREFIXES ?? '').split(',').map(v => v.trim()).filter(Boolean),
    approvalSecret: env.REDIS_APPROVAL_SECRET,
    allowDestructive: env.REDIS_ALLOW_DESTRUCTIVE === 'true',
    destructiveApprovalSecret: env.REDIS_DESTRUCTIVE_APPROVAL_SECRET,
    upstreamCommand: env.REDIS_UPSTREAM_COMMAND ?? 'uvx',
    upstreamArgs: (env.REDIS_UPSTREAM_ARGS ?? 'redis-mcp-server').split(/\s+/).filter(Boolean),
    upstreamTimeoutMs: timeout
  };
}

export function assertKeyAllowed(config: RedisConnectorConfig, key: string): void {
  if (!key || key.length > 1024) throw new Error('Redis key must be 1..1024 characters');
  if (config.allowedKeyPrefixes.length && !config.allowedKeyPrefixes.some(prefix => key.startsWith(prefix))) {
    throw new Error(`Redis key is outside configured prefixes: ${key}`);
  }
}
