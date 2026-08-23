import crypto from 'node:crypto';

export interface Config {
  apiKey: string;
  allowedIndexes: Set<string>;
  allowedNamespaces: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
}

const csv = (v?: string) => new Set((v ?? '').split(',').map(x => x.trim()).filter(Boolean));

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  if (!env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY is required');
  const timeoutMs = Number(env.PINECONE_TIMEOUT_MS ?? 15000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('PINECONE_TIMEOUT_MS must be 1000..120000');
  return {
    apiKey: env.PINECONE_API_KEY,
    allowedIndexes: csv(env.PINECONE_ALLOWED_INDEXES),
    allowedNamespaces: csv(env.PINECONE_ALLOWED_NAMESPACES),
    approvalSecret: env.PINECONE_APPROVAL_SECRET,
    timeoutMs
  };
}

export function assertAllowed(c: Config, index: string, namespace?: string) {
  if (c.allowedIndexes.size && !c.allowedIndexes.has(index)) throw new Error(`Index not allowed: ${index}`);
  if (namespace !== undefined && c.allowedNamespaces.size && !c.allowedNamespaces.has(namespace)) throw new Error(`Namespace not allowed: ${namespace}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
