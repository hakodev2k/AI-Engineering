import { describe, expect, it, vi } from 'vitest';
import { registerEasyPostTools } from '../src/tools.js';
import { loadConfig } from '../src/config.js';

describe('tool registration', () => {
  it('registers the intended scoped tools', () => {
    const names: string[] = [];
    const server = { registerTool: vi.fn((name: string) => names.push(name)) } as any;
    const client = { request: vi.fn() } as any;
    registerEasyPostTools(server, client, loadConfig({ EASYPOST_API_KEY: 'EZTK_test_key_12345' }));
    expect(names).toHaveLength(19);
    expect(names).toContain('easypost.shipment.buy');
    expect(names).toContain('easypost.tracker.delete');
    expect(names.every(n => n.startsWith('easypost.'))).toBe(true);
  });
});
