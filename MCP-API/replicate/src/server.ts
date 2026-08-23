import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ReplicateClient } from './client.js';
import { assertDeploymentAllowed, assertModelAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new ReplicateClient(config);
const server = new McpServer({ name: 'replicate-mcp-connector', version: '1.0.0' });

const slug = z.string().min(1).max(100).regex(/^[A-Za-z0-9._-]+$/);
const predictionId = z.string().min(1).max(100).regex(/^[A-Za-z0-9_-]+$/);
const approvalId = z.string().length(64).optional();
const input = z.record(z.string(), z.unknown());
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;

server.tool('replicate.model.search', 'Search public Replicate models and related public catalog content.', {
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(50).optional()
}, async a => out(await client.get('/search', { query: a.query, limit: a.limit })));

server.tool('replicate.model.get', 'Get metadata for one Replicate model.', {
  owner: slug,
  model: slug
}, async a => {
  assertModelAllowed(config, a.owner, a.model);
  return out(await client.get(`/models/${enc(a.owner)}/${enc(a.model)}`));
});

server.tool('replicate.model.version.list', 'List versions for one Replicate model.', {
  owner: slug,
  model: slug
}, async a => {
  assertModelAllowed(config, a.owner, a.model);
  return out(await client.get(`/models/${enc(a.owner)}/${enc(a.model)}/versions`));
});

server.tool('replicate.prediction.list', 'List predictions created by the authenticated Replicate account or organization.', {
  createdAfter: z.string().datetime({ offset: true }).optional(),
  createdBefore: z.string().datetime({ offset: true }).optional()
}, async a => out(await client.get('/predictions', {
  created_after: a.createdAfter,
  created_before: a.createdBefore
})));

server.tool('replicate.prediction.get', 'Get one prediction including status, outputs, metrics, and errors.', {
  id: predictionId
}, async a => out(await client.get(`/predictions/${enc(a.id)}`)));

server.tool('replicate.prediction.create', 'Create a prediction from an explicit model version. Requires approval because it can incur cost.', {
  version: z.string().min(8).max(300),
  input,
  waitSeconds: z.number().int().min(1).max(60).optional(),
  cancelAfter: z.string().regex(/^\d+(s|m|h)?(\d+m)?$/).max(30).optional(),
  approvalId
}, async a => {
  assertApproval('replicate.prediction.create', a.approvalId, config.approvalSecret);
  const headers: Record<string, string> = {};
  if (a.waitSeconds) headers.Prefer = `wait=${a.waitSeconds}`;
  if (a.cancelAfter) headers['Cancel-After'] = a.cancelAfter;
  return out(await client.post('/predictions', { version: a.version, input: a.input }, headers));
});

server.tool('replicate.model.prediction.create', 'Create a prediction using a named official Replicate model. Requires approval because it can incur cost.', {
  owner: slug,
  model: slug,
  input,
  waitSeconds: z.number().int().min(1).max(60).optional(),
  cancelAfter: z.string().regex(/^\d+(s|m|h)?(\d+m)?$/).max(30).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.owner, a.model);
  assertApproval('replicate.prediction.create', a.approvalId, config.approvalSecret);
  const headers: Record<string, string> = {};
  if (a.waitSeconds) headers.Prefer = `wait=${a.waitSeconds}`;
  if (a.cancelAfter) headers['Cancel-After'] = a.cancelAfter;
  return out(await client.post(`/models/${enc(a.owner)}/${enc(a.model)}/predictions`, { input: a.input }, headers));
});

server.tool('replicate.prediction.cancel', 'Cancel a running prediction. Requires explicit approval.', {
  id: predictionId,
  approvalId
}, async a => {
  assertApproval('replicate.prediction.cancel', a.approvalId, config.approvalSecret);
  return out(await client.post(`/predictions/${enc(a.id)}/cancel`));
});

server.tool('replicate.deployment.list', 'List deployments available to the authenticated account.', {}, async () =>
  out(await client.get('/deployments')));

server.tool('replicate.deployment.get', 'Get one deployment.', {
  owner: slug,
  deployment: slug
}, async a => {
  assertDeploymentAllowed(config, a.owner, a.deployment);
  return out(await client.get(`/deployments/${enc(a.owner)}/${enc(a.deployment)}`));
});

server.tool('replicate.deployment.prediction.create', 'Create a prediction through a Replicate deployment. Requires approval because it can incur cost.', {
  owner: slug,
  deployment: slug,
  input,
  waitSeconds: z.number().int().min(1).max(60).optional(),
  cancelAfter: z.string().regex(/^\d+(s|m|h)?(\d+m)?$/).max(30).optional(),
  approvalId
}, async a => {
  assertDeploymentAllowed(config, a.owner, a.deployment);
  assertApproval('replicate.deployment.prediction.create', a.approvalId, config.approvalSecret);
  const headers: Record<string, string> = {};
  if (a.waitSeconds) headers.Prefer = `wait=${a.waitSeconds}`;
  if (a.cancelAfter) headers['Cancel-After'] = a.cancelAfter;
  return out(await client.post(`/deployments/${enc(a.owner)}/${enc(a.deployment)}/predictions`, { input: a.input }, headers));
});

server.tool('replicate.training.list', 'List trainings created by the authenticated account or organization.', {}, async () =>
  out(await client.get('/trainings')));

server.tool('replicate.training.get', 'Get one training including current status and output metadata.', {
  id: predictionId
}, async a => out(await client.get(`/trainings/${enc(a.id)}`)));

server.tool('replicate.training.cancel', 'Cancel a running training. Requires explicit approval.', {
  id: predictionId,
  approvalId
}, async a => {
  assertApproval('replicate.training.cancel', a.approvalId, config.approvalSecret);
  return out(await client.post(`/trainings/${enc(a.id)}/cancel`));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
