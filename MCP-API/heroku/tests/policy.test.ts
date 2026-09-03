import { describe, expect, it } from 'vitest';
import { authorize } from '../src/policy.js';
import type { Config } from '../src/config.js';

const cfg = (approved: string[] = [], requireWriteApproval = true): Config => ({
  apiKey: 'x', apiBaseUrl: 'https://api.heroku.com', mcpCommand: 'npx', mcpArgs: ['-y','@heroku/mcp-server'],
  useOfficialMcp: true, timeoutMs: 1000, maxRetries: 0, requireWriteApproval, approvedActions: new Set(approved)
});

describe('policy', () => {
  it('allows reads', () => expect(() => authorize(cfg(), 'READ', 'x')).not.toThrow());
  it('blocks unapproved writes by default', () => expect(() => authorize(cfg(), 'WRITE', 'w')).toThrow(/approval/i));
  it('allows ordinary writes when write approval is disabled', () => expect(() => authorize(cfg([], false), 'WRITE', 'w')).not.toThrow());
  it('always gates high risk without exact approval', () => expect(() => authorize(cfg([], false), 'HIGH_RISK', 'r')).toThrow(/approval/i));
  it('allows exact approved high-risk fingerprint', () => expect(() => authorize(cfg(['r'], false), 'HIGH_RISK', 'r')).not.toThrow());
});
