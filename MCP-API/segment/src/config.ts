import crypto from 'node:crypto';

export type SegmentRegion = 'us' | 'eu';

export interface SegmentConfig {
  token: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
  requireWriteApproval: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SegmentConfig {
  const token = env.SEGMENT_PUBLIC_API_TOKEN?.trim();
  if (!token) throw new Error('SEGMENT_PUBLIC_API_TOKEN is required');
  const region = (env.SEGMENT_REGION ?? 'us').toLowerCase();
  if (region !== 'us' && region !== 'eu') throw new Error('SEGMENT_REGION must be us or eu');
  const timeoutMs = Number(env.SEGMENT_REQUEST_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.SEGMENT_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('SEGMENT_REQUEST_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('SEGMENT_MAX_RETRIES must be 0..5');
  return {
    token,
    baseUrl: region === 'eu' ? 'https://eu1.api.segmentapis.com' : 'https://api.segmentapis.com',
    timeoutMs,
    maxRetries,
    approvalSecret: env.SEGMENT_APPROVAL_SECRET,
    requireWriteApproval: (env.SEGMENT_REQUIRE_WRITE_APPROVAL ?? 'true').toLowerCase() !== 'false'
  };
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${JSON.stringify(payload)}`).digest('hex');
}
