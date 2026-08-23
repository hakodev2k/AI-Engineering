import { describe, expect, it } from 'vitest';
import { approvalDigest, assertAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { PineconeClient } from '../src/client.js';

describe('configuration and policy', () => {
  it('requires an API key', () => {
    expect(() => loadConfig({})).toThrow(/PINECONE_API_KEY/);
  });

  it('enforces index and namespace allowlists', () => {
    const c = loadConfig({ PINECONE_API_KEY: 'test', PINECONE_ALLOWED_INDEXES: 'docs', PINECONE_ALLOWED_NAMESPACES: 'prod' });
    expect(() => assertAllowed(c, 'docs', 'prod')).not.toThrow();
    expect(() => assertAllowed(c, 'other', 'prod')).toThrow(/Index not allowed/);
    expect(() => assertAllowed(c, 'docs', 'dev')).toThrow(/Namespace not allowed/);
  });

  it('requires a valid approval token for writes', () => {
    const secret = 'test-secret';
    const token = approvalDigest(secret, 'pinecone.record.upsert');
    expect(() => assertApproval('pinecone.record.upsert', token, secret)).not.toThrow();
    expect(() => assertApproval('pinecone.record.upsert', '0'.repeat(64), secret)).toThrow(/Invalid approval/);
    expect(() => assertApproval('pinecone.record.delete', undefined, secret)).toThrow(/Explicit approval/);
  });
});

describe('reliability', () => {
  it('bounds operations by timeout', async () => {
    const c = loadConfig({ PINECONE_API_KEY: 'test', PINECONE_TIMEOUT_MS: '1000' });
    const client = new PineconeClient(c);
    const slow = new Promise<string>(resolve => setTimeout(() => resolve('late'), 1500));
    await expect(client.withTimeout(slow)).rejects.toThrow(/timed out/);
  });

  it('returns fast operations before timeout', async () => {
    const c = loadConfig({ PINECONE_API_KEY: 'test', PINECONE_TIMEOUT_MS: '1000' });
    const client = new PineconeClient(c);
    await expect(client.withTimeout(Promise.resolve('ok'))).resolves.toBe('ok');
  });
});
