export type ChromaClientType = 'cloud' | 'http' | 'persistent' | 'ephemeral';

export interface ChromaConfig {
  clientType: ChromaClientType;
  upstreamCommand: string;
  upstreamArgs: string[];
  upstreamTimeoutMs: number;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
  approvalSecret?: string;
  maxDocumentsPerCall: number;
  upstreamEnv: Record<string, string>;
}

const CLIENT_TYPES = new Set<ChromaClientType>(['cloud', 'http', 'persistent', 'ephemeral']);
const INTERNAL_KEYS = new Set([
  'CHROMA_UPSTREAM_COMMAND',
  'CHROMA_UPSTREAM_ARGS_JSON',
  'CHROMA_UPSTREAM_TIMEOUT_MS',
  'CHROMA_REQUIRE_WRITE_APPROVAL',
  'CHROMA_ENABLE_DESTRUCTIVE',
  'CHROMA_APPROVAL_SECRET',
  'CHROMA_MAX_DOCUMENTS_PER_CALL'
]);

function required(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function booleanValue(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  if (['1', 'true', 'yes', 'on'].includes(value.toLowerCase())) return true;
  if (['0', 'false', 'no', 'off'].includes(value.toLowerCase())) return false;
  throw new Error(`Invalid boolean value: ${value}`);
}

function integerValue(value: string | undefined, fallback: number, min: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`Expected integer between ${min} and ${max}, received ${value}`);
  }
  return parsed;
}

function parseArgs(value: string | undefined): string[] {
  if (!value) return ['chroma-mcp'];
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('CHROMA_UPSTREAM_ARGS_JSON must be a JSON array of strings');
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every((v) => typeof v === 'string' && v.length > 0)) {
    throw new Error('CHROMA_UPSTREAM_ARGS_JSON must be a non-empty JSON array of strings');
  }
  return parsed;
}

function makeUpstreamEnv(env: NodeJS.ProcessEnv): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of ['PATH', 'HOME', 'USERPROFILE', 'TMP', 'TEMP', 'TMPDIR']) {
    const value = env[key];
    if (value) result[key] = value;
  }
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('CHROMA_') && !INTERNAL_KEYS.has(key) && value !== undefined) result[key] = value;
  }
  return result;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ChromaConfig {
  const rawType = required(env, 'CHROMA_CLIENT_TYPE') as ChromaClientType;
  if (!CLIENT_TYPES.has(rawType)) throw new Error('CHROMA_CLIENT_TYPE must be cloud, http, persistent, or ephemeral');

  if (rawType === 'cloud') {
    required(env, 'CHROMA_TENANT');
    required(env, 'CHROMA_DATABASE');
    required(env, 'CHROMA_API_KEY');
  } else if (rawType === 'http') {
    required(env, 'CHROMA_HOST');
  } else if (rawType === 'persistent') {
    required(env, 'CHROMA_DATA_DIR');
  }

  const requireWriteApproval = booleanValue(env.CHROMA_REQUIRE_WRITE_APPROVAL, true);
  const enableDestructive = booleanValue(env.CHROMA_ENABLE_DESTRUCTIVE, false);
  const approvalSecret = env.CHROMA_APPROVAL_SECRET?.trim() || undefined;
  if ((requireWriteApproval || enableDestructive) && (!approvalSecret || approvalSecret.length < 32)) {
    throw new Error('CHROMA_APPROVAL_SECRET must be at least 32 characters when approvals or destructive tools are enabled');
  }

  return {
    clientType: rawType,
    upstreamCommand: env.CHROMA_UPSTREAM_COMMAND?.trim() || 'uvx',
    upstreamArgs: parseArgs(env.CHROMA_UPSTREAM_ARGS_JSON),
    upstreamTimeoutMs: integerValue(env.CHROMA_UPSTREAM_TIMEOUT_MS, 20_000, 1_000, 120_000),
    requireWriteApproval,
    enableDestructive,
    approvalSecret,
    maxDocumentsPerCall: integerValue(env.CHROMA_MAX_DOCUMENTS_PER_CALL, 100, 1, 500),
    upstreamEnv: makeUpstreamEnv(env)
  };
}
