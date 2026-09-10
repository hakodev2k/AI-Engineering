import crypto from 'node:crypto';

export type Region = 'aws-na'|'aws-eu'|'aws-au'|'azure-na'|'azure-eu'|'gcp-na'|'gcp-eu';

const BASE_URLS: Record<Region,string> = {
  'aws-na':'https://api.contentstack.io/v3',
  'aws-eu':'https://eu-api.contentstack.com/v3',
  'aws-au':'https://au-api.contentstack.com/v3',
  'azure-na':'https://azure-na-api.contentstack.com/v3',
  'azure-eu':'https://azure-eu-api.contentstack.com/v3',
  'gcp-na':'https://gcp-na-api.contentstack.com/v3',
  'gcp-eu':'https://gcp-eu-api.contentstack.com/v3'
};

export interface Config {
  apiKey: string;
  managementToken: string;
  region: Region;
  baseUrl: string;
  branch: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
  approvalSecret?: string;
}

function intEnv(name:string, fallback:number, min:number, max:number):number {
  const raw = process.env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(): Config {
  const apiKey = (process.env.CONTENTSTACK_API_KEY ?? '').trim();
  const managementToken = (process.env.CONTENTSTACK_MANAGEMENT_TOKEN ?? '').trim();
  if (!apiKey) throw new Error('CONTENTSTACK_API_KEY is required');
  if (!managementToken) throw new Error('CONTENTSTACK_MANAGEMENT_TOKEN is required');
  const region = (process.env.CONTENTSTACK_REGION ?? 'aws-na') as Region;
  if (!(region in BASE_URLS)) throw new Error('CONTENTSTACK_REGION is invalid');
  const branch = (process.env.CONTENTSTACK_BRANCH ?? 'main').trim();
  if (!/^[A-Za-z0-9._/-]{1,128}$/.test(branch) || branch.includes('..')) throw new Error('CONTENTSTACK_BRANCH is invalid');
  const requireWriteApproval = (process.env.CONTENTSTACK_REQUIRE_WRITE_APPROVAL ?? 'true') !== 'false';
  const enableDestructive = process.env.CONTENTSTACK_ENABLE_DESTRUCTIVE === 'true';
  const approvalSecret = process.env.CONTENTSTACK_APPROVAL_SECRET?.trim() || undefined;
  return {
    apiKey, managementToken, region, baseUrl: BASE_URLS[region], branch,
    timeoutMs: intEnv('CONTENTSTACK_TIMEOUT_MS',15000,1000,120000),
    maxRetries: intEnv('CONTENTSTACK_MAX_RETRIES',2,0,5),
    requireWriteApproval, enableDestructive, approvalSecret
  };
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret:string, tool:string, args:Record<string,unknown>):string {
  const copy = {...args}; delete copy.approvalToken;
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonical(copy)}`).digest('hex');
}
