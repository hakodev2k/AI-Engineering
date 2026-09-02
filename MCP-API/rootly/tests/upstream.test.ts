import { describe, expect, it } from 'vitest';
import { ALLOWED_MCP_TOOLS } from '../src/upstream.js';

describe('Rootly MCP allowlist', () => {
  it('contains only the three curated analysis tools', () => {
    expect(ALLOWED_MCP_TOOLS.size).toBe(3);
    expect(ALLOWED_MCP_TOOLS.has('get_oncall_handoff_summary')).toBe(true);
    expect(ALLOWED_MCP_TOOLS.has('get_oncall_shift_metrics')).toBe(true);
    expect(ALLOWED_MCP_TOOLS.has('get_shift_incidents')).toBe(true);
    expect(ALLOWED_MCP_TOOLS.has('create_incident')).toBe(false);
  });
});
