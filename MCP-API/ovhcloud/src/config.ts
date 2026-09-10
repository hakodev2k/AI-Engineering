import crypto from 'node:crypto';

export type OvhConfig = {
  endpoint: string;
  applicationKey: string;
  applicationSecret: string;
  consumerKey: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  enableHighRisk: boolean;
  approvalSecret?: string;
};

const allowedHosts = new Set([
  'eu.api.ovh.com',
  'ca.api.ovh.com',
  'api.us.ovhcloud.com',
]);

function int(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return n;
}

export function loadConfig(): OvhConfig {
  const endpoint = process.env.OVH_ENDPOINT ?? 'https://eu.api.ovh.com/1.0';
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname)) throw new Error('OVH_ENDPOINT must be an official OVHcloud HTTPS API host');
  const applicationKey = process.env.OVH_APPLICATION_KEY ?? '';
  const applicationSecret = process.env.OVH_APPLICATION_SECRET ?? '';
  const consumerKey = process.env.OVH_CONSUMER_KEY ?? '';
  if (!applicationKey || !applicationSecret || !consumerKey) throw new Error('OVH application key, application secret, and consumer key are required');
  return {
    endpoint: endpoint.replace(/\/$/, ''),
    applicationKey,
    applicationSecret,
    consumerKey,
    timeoutMs: int('OVH_TIMEOUT_MS', 15000, 1000, 120000),
    maxRetries: int('OVH_MAX_RETRIES', 2, 0, 5),
    requireWriteApproval: process.env.OVH_REQUIRE_WRITE_APPROVAL !== 'false',
    enableHighRisk: process.env.OVH_ENABLE_HIGH_RISK === 'true',
    approvalSecret: process.env.OVH_APPROVAL_SECRET,
  };
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonicalJson(payload)}`).digest('hex');
}
