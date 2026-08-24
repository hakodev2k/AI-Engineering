import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TOOL_RISK } from '../src/policy.js';

const serverSource = readFileSync(fileURLToPath(new URL('../src/server.ts', import.meta.url)), 'utf8');
const tools = [
  'n8n.workflow.search',
  'n8n.workflow.get',
  'n8n.workflow.create',
  'n8n.workflow.update',
  'n8n.workflow.activate',
  'n8n.workflow.deactivate',
  'n8n.execution.list',
  'n8n.execution.get',
  'n8n.execution.delete',
  'n8n.tag.list',
  'n8n.tag.create',
  'n8n.project.list'
];

describe('MCP tool contract', () => {
  it('registers every documented provider-scoped tool and risk classification', () => {
    for (const tool of tools) {
      expect(serverSource).toContain(`server.tool('${tool}'`);
      expect(TOOL_RISK[tool]).toBeDefined();
    }
  });

  it('does not expose a generic arbitrary-request escape hatch', () => {
    expect(serverSource).not.toMatch(/execute_any|arbitrary.*request|raw_api|http_request/i);
  });

  it('uses current publish/unpublish endpoints and safe draft updates', () => {
    expect(serverSource).toContain('/publish`');
    expect(serverSource).toContain('/unpublish`');
    expect(serverSource).toContain('publishIfActive: false');
    expect(serverSource).not.toContain('/activate`');
    expect(serverSource).not.toContain('/deactivate`');
  });
});
