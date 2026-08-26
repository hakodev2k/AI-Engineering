import crypto from 'node:crypto';
import { z } from 'zod';

const envSchema = z.object({
  B2_KEY_ID: z.string().min(1),
  B2_APPLICATION_KEY: z.string().min(1),
  B2_REGION: z.string().min(1),
  B2_ENDPOINT: z.string().url().refine(v => v.startsWith('https://'), 'HTTPS endpoint required'),
  B2_ALLOWED_BUCKETS: z.string().optional().default(''),
  B2_ALLOWED_PREFIXES: z.string().optional().default(''),
  B2_REQUIRE_WRITE_APPROVAL: z.string().optional().default('true'),
  B2_APPROVAL_SECRET: z.string().optional(),
  B2_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).optional().default(20000),
  B2_MAX_READ_BYTES: z.coerce.number().int().min(1).max(10_485_760).optional().default(1_048_576)
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const e = envSchema.parse(env);
  const endpoint = new URL(e.B2_ENDPOINT);
  if (endpoint.protocol !== 'https:' || !endpoint.hostname.endsWith('.backblazeb2.com')) {
    throw new Error('B2_ENDPOINT must be an HTTPS backblazeb2.com endpoint');
  }
  return {
    keyId: e.B2_KEY_ID,
    applicationKey: e.B2_APPLICATION_KEY,
    region: e.B2_REGION,
    endpoint: endpoint.toString().replace(/\/$/, ''),
    allowedBuckets: new Set(e.B2_ALLOWED_BUCKETS.split(',').map(x => x.trim()).filter(Boolean)),
    allowedPrefixes: e.B2_ALLOWED_PREFIXES.split(',').map(x => x.trim()).filter(Boolean),
    requireWriteApproval: e.B2_REQUIRE_WRITE_APPROVAL.toLowerCase() !== 'false',
    approvalSecret: e.B2_APPROVAL_SECRET,
    timeoutMs: e.B2_TIMEOUT_MS,
    maxReadBytes: e.B2_MAX_READ_BYTES
  };
}

export function assertResourceAllowed(config: Config, bucket: string, key?: string) {
  if (config.allowedBuckets.size && !config.allowedBuckets.has(bucket)) throw new Error(`Bucket not allowed: ${bucket}`);
  if (key && config.allowedPrefixes.length && !config.allowedPrefixes.some(p => key.startsWith(p))) {
    throw new Error(`Object key is outside allowed prefixes: ${key}`);
  }
}

export function approvalDigest(secret: string, tool: string, canonicalInput: string) {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonicalInput}`).digest('hex');
}
