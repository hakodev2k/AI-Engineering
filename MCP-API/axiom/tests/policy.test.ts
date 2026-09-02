import { describe, expect, it } from 'vitest';
import type { Config } from '../src/config.js';
import { authorize } from '../src/policy.js';
const cfg = (approved: string[] = [], writeApproval = true) => ({ token:'x',apiUrl:'https://api.axiom.co',mcpUrl:'https://mcp.axiom.co/mcp',timeoutMs:1000,maxRetries:0,requireWriteApproval:writeApproval,enableDestructive:false,approvedActions:new Set(approved) } as Config);

describe('policy', () => {
  it('allows reads', () => expect(() => authorize(cfg(), 'READ', 'x')).not.toThrow());
  it('blocks unapproved writes by default', () => expect(() => authorize(cfg(), 'WRITE', 'w')).toThrow(/approval/i));
  it('allows configured ordinary writes', () => expect(() => authorize(cfg([], false), 'WRITE', 'w')).not.toThrow());
  it('allows exact approved writes', () => expect(() => authorize(cfg(['w']), 'WRITE', 'w')).not.toThrow());
});
