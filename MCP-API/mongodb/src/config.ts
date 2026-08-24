import crypto from 'node:crypto';

export interface ConnectorConfig {
  connectionString?: string;
  atlasClientId?: string;
  atlasClientSecret?: string;
  allowWrites: boolean;
  approvalSecret?: string;
  allowedDatabases: Set<string>;
  allowedCollections: Set<string>;
  maxDocuments: number;
  maxBytes: number;
  maxTimeMS: number;
  indexCheck: boolean;
}

const csv = (value?: string) => new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
const int = (value: string | undefined, fallback: number, min: number, max: number, name: string) => {
  const n = Number(value ?? fallback);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be an integer from ${min} to ${max}`);
  return n;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const allowWrites = (env.MONGODB_CONNECTOR_ALLOW_WRITES ?? 'false').toLowerCase() === 'true';
  if (allowWrites && !env.MONGODB_CONNECTOR_APPROVAL_SECRET) throw new Error('MONGODB_CONNECTOR_APPROVAL_SECRET is required when writes are enabled');
  return {
    connectionString: env.MDB_MCP_CONNECTION_STRING,
    atlasClientId: env.MDB_MCP_API_CLIENT_ID,
    atlasClientSecret: env.MDB_MCP_API_CLIENT_SECRET,
    allowWrites,
    approvalSecret: env.MONGODB_CONNECTOR_APPROVAL_SECRET,
    allowedDatabases: csv(env.MONGODB_CONNECTOR_ALLOWED_DATABASES),
    allowedCollections: csv(env.MONGODB_CONNECTOR_ALLOWED_COLLECTIONS),
    maxDocuments: int(env.MONGODB_CONNECTOR_MAX_DOCUMENTS, 50, 1, 100, 'MONGODB_CONNECTOR_MAX_DOCUMENTS'),
    maxBytes: int(env.MONGODB_CONNECTOR_MAX_BYTES, 1048576, 1024, 16777216, 'MONGODB_CONNECTOR_MAX_BYTES'),
    maxTimeMS: int(env.MONGODB_CONNECTOR_MAX_TIME_MS, 10000, 100, 120000, 'MONGODB_CONNECTOR_MAX_TIME_MS'),
    indexCheck: (env.MONGODB_CONNECTOR_INDEX_CHECK ?? 'true').toLowerCase() !== 'false'
  };
}

export function assertNamespaceAllowed(config: ConnectorConfig, database?: string, collection?: string) {
  if (database && config.allowedDatabases.size && !config.allowedDatabases.has(database)) throw new Error(`Database not allowed: ${database}`);
  if (collection && config.allowedCollections.size) {
    const qualified = database ? `${database}.${collection}` : collection;
    if (!config.allowedCollections.has(collection) && !config.allowedCollections.has(qualified)) throw new Error(`Collection not allowed: ${qualified}`);
  }
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
