import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest, assertResourceAllowed } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { BackblazeClient } from '../src/client.js';

const env = {
  B2_KEY_ID: 'key-id',
  B2_APPLICATION_KEY: 'secret-key',
  B2_REGION: 'us-west-004',
  B2_ENDPOINT: 'https://s3.us-west-004.backblazeb2.com',
  B2_ALLOWED_BUCKETS: 'safe-bucket',
  B2_ALLOWED_PREFIXES: 'agents/,reports/',
  B2_REQUIRE_WRITE_APPROVAL: 'true',
  B2_APPROVAL_SECRET: 'approval-secret',
  B2_TIMEOUT_MS: '5000',
  B2_MAX_READ_BYTES: '1024'
};

describe('configuration and security', () => {
  it('loads valid least-privilege configuration', () => {
    const c = loadConfig(env);
    expect(c.region).toBe('us-west-004');
    expect(c.allowedBuckets.has('safe-bucket')).toBe(true);
  });

  it('rejects arbitrary endpoints to prevent SSRF', () => {
    expect(() => loadConfig({ ...env, B2_ENDPOINT: 'https://evil.example' })).toThrow(/backblazeb2/);
  });

  it('enforces bucket and prefix allowlists', () => {
    const c = loadConfig(env);
    expect(() => assertResourceAllowed(c, 'other-bucket', 'agents/a.txt')).toThrow(/Bucket not allowed/);
    expect(() => assertResourceAllowed(c, 'safe-bucket', 'private/a.txt')).toThrow(/outside allowed prefixes/);
    expect(() => assertResourceAllowed(c, 'safe-bucket', 'agents/a.txt')).not.toThrow();
  });

  it('requires a request-bound approval for write tools', () => {
    const c = loadConfig(env);
    const input = '{"bucket":"safe-bucket","key":"agents/a.txt","text":"hello"}';
    expect(() => assertApproval(c, 'backblaze.object.write_text', input)).toThrow(/explicit approval/);
    const token = approvalDigest('approval-secret', 'backblaze.object.write_text', input);
    expect(() => assertApproval(c, 'backblaze.object.write_text', input, token)).not.toThrow();
  });

  it('never disables destructive approval', () => {
    const c = loadConfig({ ...env, B2_REQUIRE_WRITE_APPROVAL: 'false' });
    expect(() => assertApproval(c, 'backblaze.object.delete', '{"x":1}')).toThrow(/explicit approval/);
    expect(TOOL_POLICY['backblaze.object.delete'].risk).toBe('DESTRUCTIVE');
  });
});

describe('client behavior with mocked transport', () => {
  it('maps list pagination into a stable output shape', async () => {
    const c = loadConfig(env);
    const client = new BackblazeClient(c);
    vi.spyOn(client.s3, 'send').mockResolvedValue({
      Contents: [{ Key: 'agents/a.txt', Size: 5, ETag: 'etag', LastModified: new Date('2026-01-01T00:00:00Z') }],
      NextContinuationToken: 'next', IsTruncated: true
    } as never);
    const result = await client.listObjects('safe-bucket', 'agents/', undefined, 100);
    expect(result.objects[0].key).toBe('agents/a.txt');
    expect(result.nextContinuationToken).toBe('next');
    expect(result.truncated).toBe(true);
  });

  it('blocks oversized text reads before GetObject', async () => {
    const c = loadConfig(env);
    const client = new BackblazeClient(c);
    const send = vi.spyOn(client.s3, 'send').mockResolvedValueOnce({ ContentLength: 2048, ContentType: 'text/plain' } as never);
    await expect(client.readText('safe-bucket', 'agents/big.txt')).rejects.toThrow(/B2_MAX_READ_BYTES/);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('maps provider authorization failures without exposing credentials', async () => {
    const c = loadConfig(env);
    const client = new BackblazeClient(c);
    vi.spyOn(client.s3, 'send').mockRejectedValue(Object.assign(new Error('raw'), { $metadata: { httpStatusCode: 403, requestId: 'r1' } }));
    await expect(client.headBucket('safe-bucket')).rejects.toThrow('Backblaze authorization denied (request r1)');
  });
});
