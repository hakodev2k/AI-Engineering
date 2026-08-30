import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, approvalDigest } from '../src/auth/config.js';
import { TOOL_MAP, toExternalDefinitions } from '../src/tools/catalog.js';
import { POLICY, authorize, splitApproval, addApprovalSchema } from '../src/tools/policy.js';

test('tool catalog and policy stay aligned', () => {
  assert.equal(Object.keys(TOOL_MAP).length, 20);
  assert.deepEqual(Object.keys(TOOL_MAP).sort(), Object.keys(POLICY).sort());
  assert.equal(new Set(Object.values(TOOL_MAP)).size, 20);
});

test('config requires bearer API key and HTTPS', () => {
  assert.throws(() => loadConfig({}), /API_KEY/);
  assert.throws(() => loadConfig({ INCIDENT_IO_API_KEY: 'x', INCIDENT_IO_MCP_URL: 'http://mcp.incident.io/mcp' }), /HTTPS/);
  assert.equal(loadConfig({ INCIDENT_IO_API_KEY: 'x' }).mcpUrl, 'https://mcp.incident.io/mcp');
});

test('missing allowlisted upstream tools fail closed', () => {
  assert.throws(() => toExternalDefinitions([{ name: 'incident_list', description: 'x', inputSchema: { type: 'object', properties: {} } }]), /unavailable/);
});

test('upstream schemas are reused but approval is connector-local', () => {
  const upstream = Object.values(TOOL_MAP).map(name => ({ name, description: name, inputSchema: { type: 'object', properties: { id: { type: 'string' } } } }));
  const defs = toExternalDefinitions(upstream).map(addApprovalSchema);
  assert.ok(defs.find(x => x.name === 'incident-io.incident.create').inputSchema.properties.approval_token);
  assert.equal(defs.find(x => x.name === 'incident-io.incident.list').inputSchema.properties.approval_token, undefined);
});

test('read tools do not require approval', () => {
  assert.doesNotThrow(() => authorize({ highRiskEnabled: false }, 'incident-io.incident.list', {}, undefined));
});

test('write approval is payload-bound', () => {
  const config = { approvalSecret: 'secret', highRiskEnabled: true };
  const payload = { name: 'API degraded' };
  const token = approvalDigest(config.approvalSecret, 'incident-io.incident.create', payload);
  assert.doesNotThrow(() => authorize(config, 'incident-io.incident.create', payload, token));
  assert.throws(() => authorize(config, 'incident-io.incident.create', { name: 'different' }, token), /Invalid/);
});

test('high-risk tools are disabled by default', () => {
  assert.throws(() => authorize({ approvalSecret: 'x', highRiskEnabled: false }, 'incident-io.escalation.respond', {}, '0'.repeat(64)), /disabled/);
});

test('approval token is stripped before upstream forwarding', () => {
  const result = splitApproval({ id: 'abc', approval_token: 'a'.repeat(64) });
  assert.deepEqual(result.payload, { id: 'abc' });
  assert.equal(result.approvalToken.length, 64);
});
