import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, type ConnectorConfig } from '../src/config.js';
import { invokeTool } from '../src/server.js';
import type { Upstream } from '../src/upstream.js';

const config: ConnectorConfig = {
  token: 'token', org: 'org', timeoutMs: 30000, approvalSecret: 'approval-secret'
};

describe('bounded retries', () => {
  it('retries a transient read failure once', async () => {
    const call = vi.fn()
      .mockRejectedValueOnce(new Error('429 rate limit'))
      .mockResolvedValueOnce({ ok: true });
    const upstream: Upstream = { call, close: vi.fn(async () => undefined) };
    await expect(invokeTool(config, upstream, 'sonarqube.project.search', {})).resolves.toEqual({ ok: true });
    expect(call).toHaveBeenCalledTimes(2);
  });

  it('does not retry writes', async () => {
    const call = vi.fn().mockRejectedValue(new Error('503 temporarily unavailable'));
    const upstream: Upstream = { call, close: vi.fn(async () => undefined) };
    const args = { key: 'ISSUE-1', status: 'reopen' as const };
    const approvalToken = approvalDigest('approval-secret', 'sonarqube.issue.status.change', args);
    await expect(invokeTool(config, upstream, 'sonarqube.issue.status.change', { ...args, approvalToken })).rejects.toThrow('503');
    expect(call).toHaveBeenCalledTimes(1);
  });
});
