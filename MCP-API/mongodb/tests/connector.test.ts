import { describe, expect, it } from 'vitest';
import { approvalDigest, assertNamespaceAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { rejectDangerousMongoOperators } from '../src/safety.js';

describe('MongoDB connector configuration', () => {
  it('defaults to read-only safe limits', () => {
    const config = loadConfig({ MDB_MCP_CONNECTION_STRING: 'mongodb://localhost:27017' });
    expect(config.allowWrites).toBe(false);
    expect(config.maxDocuments).toBe(50);
    expect(config.maxBytes).toBe(1048576);
    expect(config.indexCheck).toBe(true);
  });

  it('requires an approval secret when writes are enabled', () => {
    expect(() => loadConfig({ MDB_MCP_CONNECTION_STRING: 'mongodb://localhost', MONGODB_CONNECTOR_ALLOW_WRITES: 'true' })).toThrow(/APPROVAL_SECRET/);
  });

  it('enforces namespace allowlists', () => {
    const config = loadConfig({
      MDB_MCP_CONNECTION_STRING: 'mongodb://localhost',
      MONGODB_CONNECTOR_ALLOWED_DATABASES: 'app',
      MONGODB_CONNECTOR_ALLOWED_COLLECTIONS: 'app.users'
    });
    expect(() => assertNamespaceAllowed(config, 'app', 'users')).not.toThrow();
    expect(() => assertNamespaceAllowed(config, 'admin')).toThrow(/not allowed/);
    expect(() => assertNamespaceAllowed(config, 'app', 'secrets')).toThrow(/not allowed/);
  });
});

describe('approval and query safety', () => {
  it('requires exact HMAC approval for writes', () => {
    const secret = 'test-secret';
    const config = loadConfig({
      MDB_MCP_CONNECTION_STRING: 'mongodb://localhost',
      MONGODB_CONNECTOR_ALLOW_WRITES: 'true',
      MONGODB_CONNECTOR_APPROVAL_SECRET: secret
    });
    const token = approvalDigest(secret, 'mongodb.document.insert_many');
    expect(() => assertApproval(config, 'mongodb.document.insert_many', token)).not.toThrow();
    expect(() => assertApproval(config, 'mongodb.document.insert_many', '0'.repeat(64))).toThrow(/Invalid approval/);
  });

  it('blocks server-side JavaScript and write-producing aggregation stages', () => {
    expect(() => rejectDangerousMongoOperators({ $where: 'sleep(1)' })).toThrow(/Unsafe MongoDB operator/);
    expect(() => rejectDangerousMongoOperators([{ $match: { active: true } }, { $out: 'copy' }])).toThrow(/Unsafe MongoDB operator/);
    expect(() => rejectDangerousMongoOperators([{ $match: { active: true } }, { $limit: 10 }])).not.toThrow();
  });
});
