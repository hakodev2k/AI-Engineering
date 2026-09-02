import { describe, expect, it } from 'vitest';
import { authorize } from '../src/policy.js';
import type { CanvaConfig } from '../src/config.js';

const config = (approved: string[] = [], requireWriteApproval = true): CanvaConfig => ({
  accessToken: 'x', apiBaseUrl: 'https://api.canva.com/rest/v1', mcpUrl: 'https://mcp.canva.com/mcp',
  timeoutMs: 1000, maxRetries: 0, requireWriteApproval, approvedActions: new Set(approved),
});

describe('permission policy', () => {
  it('allows read operations', () => expect(() => authorize(config(), 'READ', 'read')).not.toThrow());
  it('denies writes by default', () => expect(() => authorize(config(), 'WRITE', 'write:a')).toThrow(/approval/i));
  it('allows an exact externally-approved write', () => expect(() => authorize(config(['write:a']), 'WRITE', 'write:a')).not.toThrow());
  it('supports deployments that disable normal write approval', () => expect(() => authorize(config([], false), 'WRITE', 'write:a')).not.toThrow());
  it('still requires explicit approval for high-risk operations', () => expect(() => authorize(config([], false), 'HIGH_RISK', 'risk:a')).toThrow(/approval/i));
});
