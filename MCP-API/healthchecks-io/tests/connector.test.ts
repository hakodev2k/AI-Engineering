import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { HealthchecksClient, HealthchecksError } from '../src/client.js';
import { buildTools, schemas } from '../src/tools.js';

const cfg = loadConfig({
  HEALTHCHECKS_API_KEY: 'test-key',
  HEALTHCHECKS_API_BASE: 'https://healthchecks.io/api/v3',
  HEALTHCHECKS_TIMEOUT_MS: '1000',
  HEALTHCHECKS_MAX_RETRIES: '1',
  HEALTHCHECKS_APPROVAL_MODE: 'write'
});

describe('healthchecks.io connector', () => {
  it('rejects missing credentials', () => {
    expect(() => loadConfig({})).toThrow();
  });

  it('registers the expected provider-scoped tools', () => {
    const client = new HealthchecksClient(cfg, vi.fn() as any);
    const names = buildTools(client, cfg).map(t => t.name);
    expect(names).toContain('healthchecks.check.list');
    expect(names).toContain('healthchecks.check.delete');
    expect(names).toContain('healthchecks.service.status');
    expect(new Set(names).size).toBe(names.length);
  });

  it('validates check slugs strictly', () => {
    expect(() => schemas.create.parse({ name: 'Backup', slug: 'Bad Slug' })).toThrow();
    expect(schemas.create.parse({ name: 'Backup', slug: 'backup_job' }).slug).toBe('backup_job');
  });

  it('requires approval for write and destructive operations', async () => {
    const client = { createCheck: vi.fn(), deleteCheck: vi.fn() } as any;
    const tools = buildTools(client, cfg);
    await expect(tools.find(t => t.name === 'healthchecks.check.create')!.run({ name: 'Backup' })).rejects.toThrow('approval_required:WRITE');
    await expect(tools.find(t => t.name === 'healthchecks.check.delete')!.run({ id: 'abc' })).rejects.toThrow('approval_required:DESTRUCTIVE');
  });

  it('executes approved write operations', async () => {
    const client = { createCheck: vi.fn().mockResolvedValue({ uuid: 'u1' }) } as any;
    const tool = buildTools(client, cfg).find(t => t.name === 'healthchecks.check.create')!;
    await expect(tool.run({ name: 'Backup', approved: true })).resolves.toEqual({ uuid: 'u1' });
    expect(client.createCheck).toHaveBeenCalledWith({ name: 'Backup' });
  });

  it('maps non-retryable provider errors', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"error":"bad key"}', { status: 401 }));
    const client = new HealthchecksClient(cfg, fetchMock as any);
    await expect(client.listChecks()).rejects.toBeInstanceOf(HealthchecksError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries 429 then succeeds while preserving bounded retries', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('rate limited', { status: 429, headers: { 'Retry-After': '0' } }))
      .mockResolvedValueOnce(new Response('{"checks":[]}', { status: 200 }));
    const client = new HealthchecksClient(cfg, fetchMock as any);
    await expect(client.listChecks()).resolves.toEqual({ checks: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry destructive DELETE requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('temporary', { status: 503 }));
    const client = new HealthchecksClient(cfg, fetchMock as any);
    await expect(client.deleteCheck('abc')).rejects.toBeInstanceOf(HealthchecksError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
