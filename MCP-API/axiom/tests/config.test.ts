import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('config', () => {
  it('requires an API token', () => expect(() => loadConfig({} as any)).toThrow(/AXIOM_TOKEN/));
  it('requires org ID with MCP PAT', () => expect(() => loadConfig({ AXIOM_TOKEN: 'xaat-test', AXIOM_MCP_PAT: 'pat' } as any)).toThrow(/AXIOM_ORG_ID/));
  it('parses action approvals', () => {
    const c = loadConfig({ AXIOM_TOKEN: 'x', AXIOM_APPROVED_ACTIONS: 'a,b' } as any);
    expect(c.approvedActions.has('b')).toBe(true);
  });
});
