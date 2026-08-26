import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { SegmentClient } from './client.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new SegmentClient(config);
const server = new McpServer({ name: 'segment-mcp-connector', version: '1.0.0' });
const id = z.string().min(1).max(255).regex(/^[A-Za-z0-9_.:-]+$/);
const approvalId = z.string().length(64).optional();
const settings = z.record(z.string(), z.unknown());
const enc = encodeURIComponent;
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('segment.workspace.get', 'Get the Segment Workspace associated with the configured token. READ.', {}, async () => out(await client.get('/')));

server.tool('segment.source.list', 'List Sources in the configured Segment Workspace. READ.', {}, async () => out(await client.get('/sources')));
server.tool('segment.source.get', 'Get one Source by id. READ.', { sourceId: id }, async a => out(await client.get(`/sources/${enc(a.sourceId)}`)));
server.tool('segment.source.create', 'Create a Source from a catalog metadata id. WRITE; explicit approval required by default.', {
  slug: z.string().min(1).max(255).regex(/^[a-z0-9][a-z0-9-]*$/),
  enabled: z.boolean().default(true),
  metadataId: id,
  settings: settings.optional(),
  disconnectAllWarehouses: z.boolean().optional(),
  approvalId
}, async a => {
  const payload = { slug: a.slug, enabled: a.enabled, metadataId: a.metadataId, settings: a.settings, disconnectAllWarehouses: a.disconnectAllWarehouses };
  assertApproval(config, 'segment.source.create', payload, a.approvalId);
  return out(await client.post('/sources', payload));
});

server.tool('segment.destination.list', 'List Destinations in the configured Segment Workspace. READ.', {}, async () => out(await client.get('/destinations')));
server.tool('segment.destination.get', 'Get one Destination by id. READ.', { destinationId: id }, async a => out(await client.get(`/destinations/${enc(a.destinationId)}`)));
server.tool('segment.destination.update', 'Update a Destination display name, enabled state, or writable settings. WRITE; explicit approval required by default.', {
  destinationId: id,
  name: z.string().min(1).max(255).nullable().optional(),
  enabled: z.boolean().optional(),
  settings: settings.optional(),
  approvalId
}, async a => {
  const payload = { name: a.name, enabled: a.enabled, settings: a.settings };
  if (payload.name === undefined && payload.enabled === undefined && payload.settings === undefined) throw new Error('At least one writable destination field is required');
  assertApproval(config, 'segment.destination.update', { destinationId: a.destinationId, ...payload }, a.approvalId);
  return out(await client.patch(`/destinations/${enc(a.destinationId)}`, payload));
});

server.tool('segment.catalog.source.list', 'List Source integrations available in the Segment catalog. READ.', {}, async () => out(await client.get('/catalog/sources')));
server.tool('segment.catalog.destination.list', 'List Destination integrations available in the Segment catalog. READ.', {}, async () => out(await client.get('/catalog/destinations')));

server.tool('segment.tracking_plan.list', 'List Tracking Plans. READ; Segment Protocols must be enabled.', {
  type: z.enum(['ENGAGE', 'LIVE', 'PROPERTY_LIBRARY', 'RULE_LIBRARY', 'TEMPLATE']).optional()
}, async a => out(await client.get(a.type ? `/tracking-plans?type=${enc(a.type)}` : '/tracking-plans')));
server.tool('segment.tracking_plan.get', 'Get one Tracking Plan by id. READ; Segment Protocols must be enabled.', { trackingPlanId: id }, async a => out(await client.get(`/tracking-plans/${enc(a.trackingPlanId)}`)));
server.tool('segment.tracking_plan.create', 'Create a Tracking Plan. WRITE; explicit approval required. Segment Protocols must be enabled.', {
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  type: z.enum(['ENGAGE', 'LIVE', 'PROPERTY_LIBRARY', 'RULE_LIBRARY', 'TEMPLATE']),
  approvalId
}, async a => {
  const payload = { name: a.name, description: a.description, type: a.type };
  assertApproval(config, 'segment.tracking_plan.create', payload, a.approvalId);
  return out(await client.post('/tracking-plans', payload));
});
server.tool('segment.tracking_plan.update', 'Update a Tracking Plan name or description. WRITE; explicit approval required.', {
  trackingPlanId: id,
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  approvalId
}, async a => {
  const payload = { name: a.name, description: a.description };
  if (payload.name === undefined && payload.description === undefined) throw new Error('At least one field is required');
  assertApproval(config, 'segment.tracking_plan.update', { trackingPlanId: a.trackingPlanId, ...payload }, a.approvalId);
  return out(await client.patch(`/tracking-plans/${enc(a.trackingPlanId)}`, payload));
});
server.tool('segment.tracking_plan.delete', 'Delete a Tracking Plan. DESTRUCTIVE; explicit approval required.', {
  trackingPlanId: id,
  approvalId
}, async a => {
  const payload = { trackingPlanId: a.trackingPlanId };
  assertApproval(config, 'segment.tracking_plan.delete', payload, a.approvalId);
  return out(await client.delete(`/tracking-plans/${enc(a.trackingPlanId)}`));
});

const shutdown = () => { void server.close().finally(() => process.exit(0)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
