import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CannyClient } from './client.js';
import { enforcePolicy, TOOL_POLICY } from './policy.js';

const id = z.string().min(1).max(200);
const approval = { approved: z.boolean().optional().describe('Set true only after explicit human approval.') };
const page = { limit: z.number().int().min(1).max(100).optional(), skip: z.number().int().min(0).max(100000).optional() };

function ok(data: unknown) { return { content: [{ type: 'text' as const, text: JSON.stringify(data) }], structuredContent: data as Record<string, unknown> }; }

export function registerTools(server: McpServer, client: CannyClient, requireWriteApproval: boolean): void {
  server.registerTool('canny.board.list', { description: 'List Canny feedback boards. READ.', inputSchema: {} }, async () => ok(await client.call('v1/boards/list', {})));
  server.registerTool('canny.board.get', { description: 'Retrieve one Canny board by ID. READ.', inputSchema: { id } }, async ({ id }) => ok(await client.call('v1/boards/retrieve', { id })));
  server.registerTool('canny.category.list', { description: 'List categories, optionally by board. READ.', inputSchema: { boardID: id.optional(), ...page } }, async (a) => ok(await client.call('v1/categories/list', a)));
  server.registerTool('canny.post.list', { description: 'Search/list feedback posts with bounded pagination. READ.', inputSchema: { boardID: id.optional(), authorID: id.optional(), companyID: id.optional(), search: z.string().max(500).optional(), sort: z.enum(['newest','oldest','score','statusChanged']).optional(), ...page } }, async (a) => ok(await client.call('v1/posts/list', a)));
  server.registerTool('canny.post.get', { description: 'Retrieve one feedback post. READ.', inputSchema: { id } }, async ({ id }) => ok(await client.call('v1/posts/retrieve', { id })));
  server.registerTool('canny.comment.list', { description: 'List portal comments for a post using cursor pagination. READ.', inputSchema: { postID: id, limit: z.number().int().min(1).max(100).optional(), cursor: z.string().max(1000).optional() } }, async (a) => ok(await client.call('v2/comments/list', a)));
  server.registerTool('canny.user.get', { description: 'Retrieve a user by exactly one identifier. READ.', inputSchema: { id: id.optional(), userID: id.optional(), email: z.string().email().optional() } }, async (a) => {
    if ([a.id,a.userID,a.email].filter(Boolean).length !== 1) throw new Error('Provide exactly one of id, userID, email');
    return ok(await client.call('v1/users/retrieve', a));
  });
  server.registerTool('canny.post.create', { description: 'Create a feedback post. WRITE; approval required by default.', inputSchema: { authorID: id, boardID: id, title: z.string().min(1).max(200), details: z.string().min(1).max(20000), categoryID: id.optional(), ...approval } }, async ({ approved, ...a }) => { enforcePolicy('canny.post.create',{approved},requireWriteApproval); return ok(await client.call('v1/posts/create', a)); });
  server.registerTool('canny.post.update', { description: 'Update title/details/ETA of a post. WRITE; approval required by default.', inputSchema: { postID: id, title: z.string().min(1).max(200).optional(), details: z.string().max(20000).optional(), eta: z.string().regex(/^\d{2}\/\d{4}$/).optional(), etaPublic: z.boolean().optional(), ...approval } }, async ({ approved, ...a }) => { if (!a.title && !a.details && !a.eta && a.etaPublic === undefined) throw new Error('At least one update field is required'); enforcePolicy('canny.post.update',{approved},requireWriteApproval); return ok(await client.call('v1/posts/update', a)); });
  server.registerTool('canny.post.change_status', { description: 'Change post status and optionally notify voters. HIGH_RISK because it changes roadmap state and can notify users.', inputSchema: { postID: id, changerID: id, status: z.string().min(1).max(100), shouldNotifyVoters: z.boolean(), commentValue: z.string().max(2500).default(''), ...approval } }, async ({ approved, ...a }) => { enforcePolicy('canny.post.change_status',{approved},requireWriteApproval); return ok(await client.call('v1/posts/change_status', a)); });
  server.registerTool('canny.comment.create', { description: 'Create a portal comment. WRITE; approval required, especially when notifications are enabled.', inputSchema: { authorID: id, postID: id, value: z.string().min(1).max(2500), internal: z.boolean().optional(), shouldNotifyVoters: z.boolean().default(false), parentID: id.optional(), ...approval } }, async ({ approved, ...a }) => { enforcePolicy('canny.comment.create',{approved},requireWriteApproval); return ok(await client.call('v1/comments/create', a)); });
  server.registerTool('canny.vote.create', { description: 'Create a vote for a user. WRITE; approval required by default.', inputSchema: { postID: id, voterID: id, byID: id.optional(), votePriority: z.union([z.literal(0),z.literal(10),z.literal(20)]).optional(), ...approval } }, async ({ approved, ...a }) => { enforcePolicy('canny.vote.create',{approved},requireWriteApproval); return ok(await client.call('v1/votes/create', a)); });
}

export { TOOL_POLICY };
