import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { FigmaClient } from './client.js';
import { assertFileAllowed, assertTeamAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new FigmaClient(config);
const server = new McpServer({ name: 'figma-mcp-connector', version: '1.0.0' });
const fileKey = z.string().min(6).max(256).regex(/^[A-Za-z0-9_-]+$/);
const teamId = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const nodeId = z.string().min(1).max(256).regex(/^[A-Za-z0-9:;._-]+$/);
const approvalId = z.string().length(64).optional();
const enc = encodeURIComponent;
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('figma.file.get', 'Read a Figma file document tree or a bounded subset. READ; file_content:read.', {
  fileKey,
  version: z.string().max(256).optional(),
  ids: z.array(nodeId).max(100).optional(),
  depth: z.number().int().min(1).max(20).optional(),
  branchData: z.boolean().optional()
}, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}`, {
    version: a.version,
    ids: a.ids?.join(','),
    depth: a.depth,
    branch_data: a.branchData
  }));
});

server.tool('figma.file.nodes', 'Read selected nodes and descendants from a Figma file. READ; file_content:read.', {
  fileKey,
  ids: z.array(nodeId).min(1).max(100),
  version: z.string().max(256).optional(),
  depth: z.number().int().min(1).max(20).optional()
}, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/nodes`, { ids: a.ids.join(','), version: a.version, depth: a.depth }));
});

server.tool('figma.image.render', 'Render one or more Figma nodes to expiring image URLs. READ; file_content:read.', {
  fileKey,
  ids: z.array(nodeId).min(1).max(100),
  scale: z.number().min(0.01).max(4).optional(),
  format: z.enum(['jpg', 'png', 'svg', 'pdf']).optional(),
  svgOutlineText: z.boolean().optional()
}, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/images/${enc(a.fileKey)}`, {
    ids: a.ids.join(','), scale: a.scale, format: a.format, svg_outline_text: a.svgOutlineText
  }));
});

server.tool('figma.image_fills.list', 'List expiring download URLs for image fills in a file. READ; file_content:read.', { fileKey }, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/images`));
});

server.tool('figma.comment.list', 'List comments on a file. READ; file_comments:read.', {
  fileKey, asMarkdown: z.boolean().optional()
}, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/comments`, { as_md: a.asMarkdown }));
});

server.tool('figma.comment.create', 'Post a comment to a Figma file. WRITE; explicit approval; file_comments:write.', {
  fileKey,
  message: z.string().min(1).max(10000),
  commentId: z.string().max(256).optional(),
  nodeId: nodeId.optional(),
  approvalId
}, async a => {
  assertFileAllowed(config, a.fileKey);
  assertApproval('figma.comment.create', a.approvalId, config.approvalSecret);
  const body: Record<string, unknown> = { message: a.message };
  if (a.commentId) body.comment_id = a.commentId;
  if (a.nodeId) body.client_meta = { node_id: a.nodeId };
  return out(await client.post(`/v1/files/${enc(a.fileKey)}/comments`, body));
});

server.tool('figma.component.list_file', 'List published components in a file library. READ; library_content:read.', { fileKey }, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/components`));
});

server.tool('figma.component_set.list_file', 'List published component sets in a file library. READ; library_content:read.', { fileKey }, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/component_sets`));
});

server.tool('figma.style.list_file', 'List published styles in a file library. READ; library_content:read.', { fileKey }, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/styles`));
});

server.tool('figma.variables.local', 'Read local and referenced variables. READ; Enterprise feature; file_variables:read.', { fileKey }, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/variables/local`));
});

server.tool('figma.variables.published', 'Read variables published from a file. READ; Enterprise feature; file_variables:read.', { fileKey }, async a => {
  assertFileAllowed(config, a.fileKey);
  return out(await client.get(`/v1/files/${enc(a.fileKey)}/variables/published`));
});

server.tool('figma.webhook.list', 'List webhooks for an allowed context. READ; webhooks:read.', {
  context: z.enum(['team', 'project', 'file']),
  contextId: z.string().min(1).max(256),
  teamId: teamId.optional(),
  planApiId: z.string().max(256).optional()
}, async a => {
  if (a.context === 'file') assertFileAllowed(config, a.contextId);
  if (a.context === 'team') assertTeamAllowed(config, a.contextId);
  if (a.teamId) assertTeamAllowed(config, a.teamId);
  return out(await client.get('/v2/webhooks', { context: a.context, context_id: a.contextId, plan_api_id: a.planApiId }));
});

server.tool('figma.webhook.create', 'Create a Figma webhook. HIGH_RISK because it sends external callbacks; explicit approval; webhooks:write.', {
  eventType: z.enum(['PING', 'FILE_UPDATE', 'FILE_DELETE', 'FILE_VERSION_UPDATE', 'LIBRARY_PUBLISH', 'FILE_COMMENT']),
  context: z.enum(['team', 'project', 'file']),
  contextId: z.string().min(1).max(256),
  endpoint: z.string().url().max(2048).refine(v => v.startsWith('https://'), 'Webhook endpoint must use HTTPS'),
  passcode: z.string().min(8).max(256),
  status: z.enum(['ACTIVE', 'PAUSED']).optional(),
  approvalId
}, async a => {
  if (a.context === 'file') assertFileAllowed(config, a.contextId);
  if (a.context === 'team') assertTeamAllowed(config, a.contextId);
  assertApproval('figma.webhook.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/v2/webhooks', {
    event_type: a.eventType,
    context: a.context,
    context_id: a.contextId,
    endpoint: a.endpoint,
    passcode: a.passcode,
    status: a.status ?? 'PAUSED'
  }));
});

server.tool('figma.webhook.delete', 'Delete a Figma webhook. DESTRUCTIVE; explicit approval; webhooks:write.', {
  webhookId: z.string().min(1).max(256), approvalId
}, async a => {
  assertApproval('figma.webhook.delete', a.approvalId, config.approvalSecret);
  return out(await client.delete(`/v2/webhooks/${enc(a.webhookId)}`));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
