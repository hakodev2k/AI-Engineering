import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';
import type { Config } from '../src/config.js';

const cfg = (approved: string[] = [], requireWriteApproval = true): Config => ({
  apiToken: 'token', apiBaseUrl: 'https://api.todoist.com/api/v1', mcpUrl: 'https://ai.todoist.net/mcp',
  timeoutMs: 1000, maxRetries: 0, requireWriteApproval, approvedActions: new Set(approved)
});

describe('configuration and policy', () => {
  it('requires the API token', () => expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/TODOIST_API_TOKEN/));
  it('defaults to write approval', () => expect(loadConfig({ TODOIST_API_TOKEN: 'x' } as NodeJS.ProcessEnv).requireWriteApproval).toBe(true));
  it('allows reads', () => expect(() => authorize(cfg(), 'READ', 'read')).not.toThrow());
  it('blocks unapproved writes', () => expect(() => authorize(cfg(), 'WRITE', 'write')).toThrow(/approval/i));
  it('allows a pre-approved exact action', () => expect(() => authorize(cfg(['write']), 'WRITE', 'write')).not.toThrow());
  it('can disable ordinary write approval', () => expect(() => authorize(cfg([], false), 'WRITE', 'write')).not.toThrow());
  it('never enables destructive operations', () => expect(() => authorize(cfg(['delete']), 'DESTRUCTIVE', 'delete')).toThrow(/disabled/i));
});
