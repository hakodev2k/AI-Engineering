import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { KeygenClient } from './client.js';
import { assertAllowed } from './policy.js';

const config = loadConfig();
const client = new KeygenClient(config);
const server = new McpServer({ name: 'keygen-mcp-connector', version: '1.0.0' });
const id = z.string().uuid();
const approvalId = z.string().regex(/^[a-f0-9]{64}$/).optional();
const output = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('keygen.license.list', 'List Keygen licenses with bounded pagination. Permission: READ.', {
  limit: z.number().int().min(1).max(100).default(25),
  page: z.number().int().min(1).max(10000).default(1),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRING', 'EXPIRED', 'SUSPENDED', 'BANNED']).optional()
}, async a => output(await client.listLicenses(a.limit, a.page, a.status)));

server.tool('keygen.license.get', 'Retrieve one Keygen license. Permission: READ.', { id }, async a => output(await client.getLicense(a.id)));

server.tool('keygen.license.validate', 'Validate one license, optionally scoped to a machine fingerprint. Permission: READ.', {
  id,
  fingerprint: z.string().min(1).max(512).optional()
}, async a => output(await client.validateLicense(a.id, a.fingerprint)));

server.tool('keygen.license.create', 'Create a license under an existing policy. Permission: WRITE. Requires explicit approval.', {
  policyId: id,
  name: z.string().min(1).max(256).optional(),
  expiry: z.string().datetime({ offset: true }).optional(),
  approvalId
}, async a => {
  assertAllowed('keygen.license.create', 'WRITE', a.approvalId, config);
  return output(await client.createLicense(a.policyId, a.name, a.expiry));
});

server.tool('keygen.license.suspend', 'Suspend a license. Permission: HIGH_RISK. Requires explicit approval.', { id, approvalId }, async a => {
  assertAllowed('keygen.license.suspend', 'HIGH_RISK', a.approvalId, config);
  return output(await client.suspendLicense(a.id));
});

server.tool('keygen.license.reinstate', 'Reinstate a suspended license. Permission: HIGH_RISK. Requires explicit approval.', { id, approvalId }, async a => {
  assertAllowed('keygen.license.reinstate', 'HIGH_RISK', a.approvalId, config);
  return output(await client.reinstateLicense(a.id));
});

server.tool('keygen.machine.list', 'List activated machines, optionally filtered by license. Permission: READ.', {
  limit: z.number().int().min(1).max(100).default(25),
  page: z.number().int().min(1).max(10000).default(1),
  license: id.optional()
}, async a => output(await client.listMachines(a.limit, a.page, a.license)));

server.tool('keygen.machine.deactivate', 'Deactivate a machine. Permission: DESTRUCTIVE. Disabled by default and requires explicit approval.', { id, approvalId }, async a => {
  assertAllowed('keygen.machine.deactivate', 'DESTRUCTIVE', a.approvalId, config);
  return output(await client.deactivateMachine(a.id));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
