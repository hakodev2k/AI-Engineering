import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { BoxClient, BoxError } from './client.js';
import { assertApproved, TOOL_POLICY } from './policy.js';

const config = loadConfig();
const client = new BoxClient(config);
const server = new McpServer({ name: 'box-connector', version: '1.0.0' });
const id = z.string().regex(/^\d+$/, 'Box IDs must be numeric strings');
const approval = z.string().length(64).optional();
const pageLimit = z.number().int().min(1).max(1000).default(100);

function output(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ data, untrusted: true }, null, 2) }] };
}
function fail(error: unknown) {
  if (error instanceof BoxError) {
    return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: 'BOX_API_ERROR', status: error.status, retryAfter: error.retryAfter, details: error.body }) }] };
  }
  return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: 'CONNECTOR_ERROR', message: error instanceof Error ? error.message : String(error) }) }] };
}

server.tool('box.item.search', 'Search files, folders, and other Box items visible to the authenticated user.', { query: z.string().min(1).max(200), limit: pageLimit, offset: z.number().int().min(0).default(0) }, async a => { try { return output(await client.search(a.query, a.limit, a.offset)); } catch (e) { return fail(e); } });
server.tool('box.folder.list', 'List child items in a Box folder.', { folderId: id, limit: pageLimit, offset: z.number().int().min(0).default(0) }, async a => { try { return output(await client.listFolder(a.folderId, a.limit, a.offset)); } catch (e) { return fail(e); } });
server.tool('box.file.get', 'Read Box file metadata.', { fileId: id }, async a => { try { return output(await client.getFile(a.fileId)); } catch (e) { return fail(e); } });
server.tool('box.folder.get', 'Read Box folder metadata.', { folderId: id }, async a => { try { return output(await client.getFolder(a.folderId)); } catch (e) { return fail(e); } });
server.tool('box.folder.create', 'Create a folder under an existing Box folder.', { name: z.string().trim().min(1).max(255), parentId: id, approvalId: approval }, async a => { try { assertApproved('box.folder.create', a.approvalId, config); return output(await client.createFolder(a.name, a.parentId)); } catch (e) { return fail(e); } });
server.tool('box.file.upload', 'Upload a small file from base64 content to Box.', { name: z.string().trim().min(1).max(255), parentId: id, contentBase64: z.string().min(1).max(20_000_000), approvalId: approval }, async a => { try { assertApproved('box.file.upload', a.approvalId, config); return output(await client.uploadFile(a.name, a.parentId, a.contentBase64)); } catch (e) { return fail(e); } });
server.tool('box.file.update', 'Rename, describe, or move a Box file.', { fileId: id, name: z.string().trim().min(1).max(255).optional(), description: z.string().max(10000).optional(), parentId: id.optional(), approvalId: approval }, async a => { try { assertApproved('box.file.update', a.approvalId, config); if (a.name === undefined && a.description === undefined && a.parentId === undefined) throw new Error('At least one update field is required'); return output(await client.updateFile(a.fileId, { name: a.name, description: a.description, parentId: a.parentId })); } catch (e) { return fail(e); } });
server.tool('box.comment.list', 'List comments on a Box file.', { fileId: id, limit: pageLimit, offset: z.number().int().min(0).default(0) }, async a => { try { return output(await client.listComments(a.fileId, a.limit, a.offset)); } catch (e) { return fail(e); } });
server.tool('box.comment.create', 'Create a comment on a Box file.', { fileId: id, message: z.string().trim().min(1).max(10000), approvalId: approval }, async a => { try { assertApproved('box.comment.create', a.approvalId, config); return output(await client.createComment(a.fileId, a.message)); } catch (e) { return fail(e); } });
server.tool('box.webhook.list', 'List V2 webhooks owned by the authenticated Box user.', { limit: pageLimit, marker: z.string().min(1).max(500).optional() }, async a => { try { return output(await client.listWebhooks(a.limit, a.marker)); } catch (e) { return fail(e); } });
server.tool('box.webhook.create', 'Create a V2 webhook for a specific Box file or folder. HTTPS callback required.', { targetType: z.enum(['file', 'folder']), targetId: id, address: z.string().url().refine(v => new URL(v).protocol === 'https:', 'Webhook URL must use HTTPS'), triggers: z.array(z.string().regex(/^[A-Z0-9_.]+$/)).min(1).max(50), approvalId: approval }, async a => { try { assertApproved('box.webhook.create', a.approvalId, config); return output(await client.createWebhook(a.targetType, a.targetId, a.address, a.triggers)); } catch (e) { return fail(e); } });
server.tool('box.webhook.delete', 'Delete a Box V2 webhook. Disabled by default and requires explicit approval.', { webhookId: id, approvalId: approval }, async a => { try { assertApproved('box.webhook.delete', a.approvalId, config); return output(await client.deleteWebhook(a.webhookId)); } catch (e) { return fail(e); } });

export function registeredToolNames() { return Object.keys(TOOL_POLICY); }

if (process.env.NODE_ENV !== 'test') {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
