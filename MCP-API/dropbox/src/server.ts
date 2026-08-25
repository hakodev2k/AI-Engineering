import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { loadConfig } from './config.js';
import { DropboxHybrid } from './hybrid.js';
import { assertApproval, POLICY } from './policy.js';

const config = loadConfig();
const provider = new DropboxHybrid(config);
const server = new McpServer({ name: 'dropbox-connector', version: '1.0.0' });

const path = z.string().max(4096).refine(v => v === '' || v.startsWith('/'), 'Dropbox path must be empty root or start with /');
const writePath = z.string().min(2).max(4096).startsWith('/');
const approval = z.string().max(256).optional();

function result(value: unknown) {
  const payload = { untrusted_provider_data: true, result: value };
  return { content: [{ type: 'text' as const, text: JSON.stringify(payload) }], structuredContent: payload };
}

function approve(tool: string, args: Record<string, unknown>, approvalId?: string) {
  assertApproval(tool, args, approvalId, config);
}

server.registerTool('dropbox.account.whoami', {
  description: 'Return the authenticated Dropbox account identity and namespace context. Risk: READ.',
  inputSchema: z.object({}),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
}, async () => result(await provider.whoAmI()));

server.registerTool('dropbox.folder.list', {
  description: 'List a Dropbox folder with cursor pagination. Risk: READ.',
  inputSchema: z.object({
    path,
    recursive: z.boolean().default(false),
    limit: z.number().int().min(1).max(100).default(100),
    cursor: z.string().min(1).max(8192).optional()
  }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
}, async args => result(await provider.listFolder(args)));

server.registerTool('dropbox.file.metadata', {
  description: 'Read metadata for a file or folder by path or Dropbox ID. Risk: READ.',
  inputSchema: z.object({ path: z.string().min(1).max(4096) }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
}, async ({ path }) => result(await provider.getMetadata(path)));

server.registerTool('dropbox.search', {
  description: 'Search Dropbox files and folders by name/content using official MCP or API search. Risk: READ.',
  inputSchema: z.object({
    query: z.string().min(1).max(1000),
    path: path.optional(),
    maxResults: z.number().int().min(1).max(100).default(20)
  }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
}, async args => result(await provider.search(args)));

server.registerTool('dropbox.shared_link.list', {
  description: 'List shared links, optionally scoped to a path. Risk: READ.',
  inputSchema: z.object({ path: path.optional(), cursor: z.string().min(1).max(8192).optional() }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
}, async ({ path, cursor }) => result(await provider.listSharedLinks(path, cursor)));

server.registerTool('dropbox.file.revisions.list', {
  description: 'List file revision history. Risk: READ.',
  inputSchema: z.object({ path: writePath, limit: z.number().int().min(1).max(100).default(20) }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
}, async ({ path, limit }) => result(await provider.listRevisions(path, limit)));

server.registerTool('dropbox.folder.create', {
  description: 'Create a Dropbox folder. Risk: WRITE; approval is configurable and enabled by default.',
  inputSchema: z.object({ path: writePath, approval_id: approval }),
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
}, async ({ path, approval_id }) => {
  const args = { path }; approve('dropbox.folder.create', args, approval_id);
  return result(await provider.createFolder(path));
});

server.registerTool('dropbox.file.create_text', {
  description: 'Create a UTF-8 text file, limited to 5 MiB. Risk: WRITE; approval is configurable and enabled by default.',
  inputSchema: z.object({
    path: writePath,
    content: z.string().refine(v => Buffer.byteLength(v, 'utf8') <= 5 * 1024 * 1024, 'content exceeds 5 MiB'),
    autorename: z.boolean().default(false),
    approval_id: approval
  }),
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
}, async ({ path, content, autorename, approval_id }) => {
  const args = { path, content, autorename }; approve('dropbox.file.create_text', args, approval_id);
  return result(await provider.createTextFile(path, content, autorename));
});

server.registerTool('dropbox.file.copy', {
  description: 'Copy a file or folder within Dropbox. Risk: WRITE; approval is configurable and enabled by default.',
  inputSchema: z.object({ from_path: writePath, to_path: writePath, autorename: z.boolean().default(false), approval_id: approval }),
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
}, async ({ from_path, to_path, autorename, approval_id }) => {
  const args = { from_path, to_path, autorename }; approve('dropbox.file.copy', args, approval_id);
  return result(await provider.copy(from_path, to_path, autorename));
});

server.registerTool('dropbox.file.move', {
  description: 'Move or rename a file or folder within Dropbox. Risk: WRITE; approval is configurable and enabled by default.',
  inputSchema: z.object({ from_path: writePath, to_path: writePath, autorename: z.boolean().default(false), approval_id: approval }),
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true }
}, async ({ from_path, to_path, autorename, approval_id }) => {
  const args = { from_path, to_path, autorename }; approve('dropbox.file.move', args, approval_id);
  return result(await provider.move(from_path, to_path, autorename));
});

server.registerTool('dropbox.shared_link.create', {
  description: 'Create a Dropbox shared link. This can expose content externally. Risk: HIGH_RISK; explicit approval is always required.',
  inputSchema: z.object({ path: writePath, audience: z.enum(['public', 'team', 'no_one']).default('public'), approval_id: approval }),
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
}, async ({ path, audience, approval_id }) => {
  const args = { path, audience }; approve('dropbox.shared_link.create', args, approval_id);
  return result(await provider.createSharedLink(path, audience));
});

server.registerTool('dropbox.file.revision.restore', {
  description: 'Restore an older file revision, replacing/recreating content at a path. Risk: HIGH_RISK; explicit approval is always required.',
  inputSchema: z.object({ path: writePath, rev: z.string().min(1).max(256), approval_id: approval }),
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true }
}, async ({ path, rev, approval_id }) => {
  const args = { path, rev }; approve('dropbox.file.revision.restore', args, approval_id);
  return result(await provider.restoreRevision(path, rev));
});

server.registerTool('dropbox.file.delete', {
  description: 'Move a file or folder to Dropbox Deleted files. Risk: DESTRUCTIVE; explicit approval is always required.',
  inputSchema: z.object({ path: writePath, parent_rev: z.string().min(1).max(256).optional(), approval_id: approval }),
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true }
}, async ({ path, parent_rev, approval_id }) => {
  const args = { path, parent_rev }; approve('dropbox.file.delete', args, approval_id);
  return result(await provider.delete(path, parent_rev));
});

export { server, provider, POLICY };

if (process.env.NODE_ENV !== 'test') {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const shutdown = async () => { await provider.close(); process.exit(0); };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
