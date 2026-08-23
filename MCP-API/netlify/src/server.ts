import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { NetlifyClient } from './client.js';
import { assertSiteAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new NetlifyClient(config);
const server = new McpServer({ name: 'netlify-mcp-connector', version: '1.0.0' });
const siteId = z.string().min(1).max(255);
const deployId = z.string().min(1).max(255);
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('netlify.site.list', 'List Netlify projects/sites accessible to the authenticated identity.', {
  page: z.number().int().min(1).max(10000).optional(), perPage: z.number().int().min(1).max(100).optional()
}, async a => out(await client.get('/sites', { page: a.page, per_page: a.perPage })));

server.tool('netlify.site.get', 'Get Netlify project/site metadata.', { siteId }, async a => {
  assertSiteAllowed(config, a.siteId);
  return out(await client.get(`/sites/${encodeURIComponent(a.siteId)}`));
});

server.tool('netlify.deploy.list', 'List deploys for a Netlify site.', {
  siteId, page: z.number().int().min(1).max(10000).optional(), perPage: z.number().int().min(1).max(100).optional()
}, async a => {
  assertSiteAllowed(config, a.siteId);
  return out(await client.get(`/sites/${encodeURIComponent(a.siteId)}/deploys`, { page: a.page, per_page: a.perPage }));
});

server.tool('netlify.deploy.get', 'Get one Netlify deploy.', { deployId }, async a => out(await client.get(`/deploys/${encodeURIComponent(a.deployId)}`)));

server.tool('netlify.deploy.restore', 'Restore/publish a previous deploy. HIGH_RISK; requires explicit approval.', {
  siteId, deployId, approvalId
}, async a => {
  assertSiteAllowed(config, a.siteId);
  assertApproval('netlify.deploy.restore', a.approvalId, config.approvalSecret);
  return out(await client.post(`/sites/${encodeURIComponent(a.siteId)}/deploys/${encodeURIComponent(a.deployId)}/restore`));
});

server.tool('netlify.deploy.cancel', 'Cancel an in-progress deploy. Requires explicit approval.', {
  deployId, approvalId
}, async a => {
  assertApproval('netlify.deploy.cancel', a.approvalId, config.approvalSecret);
  return out(await client.post(`/deploys/${encodeURIComponent(a.deployId)}/cancel`));
});

server.tool('netlify.form.list', 'List forms discovered for a Netlify site.', { siteId }, async a => {
  assertSiteAllowed(config, a.siteId);
  return out(await client.get(`/sites/${encodeURIComponent(a.siteId)}/forms`));
});

server.tool('netlify.submission.list', 'List form submissions for a site.', {
  siteId, page: z.number().int().min(1).max(10000).optional(), perPage: z.number().int().min(1).max(100).optional()
}, async a => {
  assertSiteAllowed(config, a.siteId);
  return out(await client.get(`/sites/${encodeURIComponent(a.siteId)}/submissions`, { page: a.page, per_page: a.perPage }));
});

server.tool('netlify.hook.list', 'List notification hooks for a site.', { siteId }, async a => {
  assertSiteAllowed(config, a.siteId);
  return out(await client.get('/hooks', { site_id: a.siteId }));
});

server.tool('netlify.hook.create', 'Create a Netlify notification hook. External side effect; requires explicit approval.', {
  siteId,
  type: z.enum(['url', 'email', 'slack']),
  event: z.string().min(1).max(100),
  data: z.record(z.string(), z.unknown()),
  formId: z.string().max(255).optional(),
  approvalId
}, async a => {
  assertSiteAllowed(config, a.siteId);
  assertApproval('netlify.hook.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/hooks', { site_id: a.siteId, type: a.type, event: a.event, data: a.data, form_id: a.formId }));
});

server.tool('netlify.hook.delete', 'Permanently delete a Netlify notification hook. DESTRUCTIVE; requires explicit approval.', {
  hookId: z.string().min(1).max(255), approvalId
}, async a => {
  assertApproval('netlify.hook.delete', a.approvalId, config.approvalSecret);
  return out(await client.delete(`/hooks/${encodeURIComponent(a.hookId)}`));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
