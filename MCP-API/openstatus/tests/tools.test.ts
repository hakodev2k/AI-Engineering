import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getToolDefinition, toolDefinitions } from '../src/tools.js';

describe('tool registry', () => {
  it('registers exactly the intended provider-scoped tools', () => {
    expect(toolDefinitions).toHaveLength(15);
    expect(new Set(toolDefinitions.map((tool) => tool.name)).size).toBe(15);
    expect(toolDefinitions.every((tool) => tool.name.startsWith('openstatus.'))).toBe(true);
  });

  it('validates bounded monitor pagination', () => {
    const tool = getToolDefinition('openstatus.monitor.list');
    expect(tool).toBeDefined();
    const schema = z.object(tool!.inputSchema).strict();
    expect(schema.parse({ page: 1, perPage: 50 })).toMatchObject({ page: 1, perPage: 50 });
    expect(() => schema.parse({ page: 0, perPage: 50 })).toThrow();
    expect(() => schema.parse({ page: 1, perPage: 51 })).toThrow();
  });

  it('requires explicit approval and notify choice for maintenance creation', () => {
    const tool = getToolDefinition('openstatus.maintenance.create')!;
    const schema = z.object(tool.inputSchema).strict();
    const base = {
      title: 'Database maintenance',
      message: 'Planned database maintenance.',
      from: '2026-09-10T03:00:00Z',
      to: '2026-09-10T04:00:00Z',
      pageId: 1,
      pageComponentIds: [2],
      notify: false,
    };
    expect(() => schema.parse(base)).toThrow();
    const parsed = schema.parse({ ...base, approved: true });
    expect(tool.prepare!(parsed)).not.toHaveProperty('approved');
  });

  it('rejects inverted maintenance windows', () => {
    const tool = getToolDefinition('openstatus.maintenance.create')!;
    expect(() => tool.prepare!({
      title: 'Maintenance', message: 'Message',
      from: '2026-09-10T04:00:00Z', to: '2026-09-10T03:00:00Z',
      pageId: 1, pageComponentIds: [], notify: false, approved: true,
    })).toThrow('to must be strictly later than from');
  });
});
