import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertProjectAllowed, assertTeamAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { LinearUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new LinearUpstream(config);
const server = new McpServer({ name: 'linear-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();

function output(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
}

server.tool('linear.issue.list', 'List/search issues visible to the connected Linear identity.', {
  query: z.string().max(500).optional(), teamId: z.string().min(1).optional(), projectId: z.string().min(1).optional(), limit: z.number().int().min(1).max(100).optional()
}, async (a) => {
  assertTeamAllowed(config, a.teamId); assertProjectAllowed(config, a.projectId);
  return output(await upstream.call('list_issues', a));
});

server.tool('linear.issue.get', 'Get one Linear issue by identifier or ID.', {
  id: z.string().min(1).max(200)
}, async (a) => output(await upstream.call('get_issue', a)));

server.tool('linear.project.list', 'List/search Linear projects.', {
  query: z.string().max(500).optional(), teamId: z.string().min(1).optional(), limit: z.number().int().min(1).max(100).optional()
}, async (a) => { assertTeamAllowed(config, a.teamId); return output(await upstream.call('list_projects', a)); });

server.tool('linear.project.get', 'Get a Linear project.', {
  id: z.string().min(1).max(200)
}, async (a) => { assertProjectAllowed(config, a.id); return output(await upstream.call('get_project', a)); });

server.tool('linear.comment.list', 'List comments for an issue.', {
  issueId: z.string().min(1).max(200)
}, async (a) => output(await upstream.call('list_comments', { issueId: a.issueId })));

server.tool('linear.user.list', 'List/search Linear users.', {
  query: z.string().max(300).optional(), limit: z.number().int().min(1).max(100).optional()
}, async (a) => output(await upstream.call('list_users', a)));

server.tool('linear.label.list', 'List/search issue labels.', {
  query: z.string().max(300).optional(), teamId: z.string().min(1).optional(), limit: z.number().int().min(1).max(100).optional()
}, async (a) => { assertTeamAllowed(config, a.teamId); return output(await upstream.call('list_issue_labels', a)); });

server.tool('linear.issue.save', 'Create or update an issue through Linear MCP. Requires approval.', {
  id: z.string().max(200).optional(), teamId: z.string().min(1).optional(), projectId: z.string().min(1).optional(), title: z.string().min(1).max(500).optional(), description: z.string().max(100000).optional(), state: z.string().max(200).optional(), priority: z.number().int().min(0).max(4).optional(), assignee: z.string().max(200).optional(), labels: z.array(z.string().max(200)).max(50).optional(), approvalId
}, async (a) => {
  assertTeamAllowed(config, a.teamId); assertProjectAllowed(config, a.projectId); assertApproval('linear.issue.save', a.approvalId, config.approvalSecret);
  const clean = { ...a }; delete clean.approvalId;
  return output(await upstream.call('save_issue', clean));
});

server.tool('linear.project.save', 'Create or update a project. Requires approval.', {
  id: z.string().max(200).optional(), teamId: z.string().min(1).optional(), name: z.string().min(1).max(500).optional(), summary: z.string().max(2000).optional(), description: z.string().max(100000).optional(), state: z.string().max(200).optional(), targetDate: z.string().max(64).optional(), approvalId
}, async (a) => {
  assertTeamAllowed(config, a.teamId); assertProjectAllowed(config, a.id); assertApproval('linear.project.save', a.approvalId, config.approvalSecret);
  const clean = { ...a }; delete clean.approvalId;
  return output(await upstream.call('save_project', clean));
});

server.tool('linear.document.save', 'Create or update a Linear document. Requires approval.', {
  id: z.string().max(200).optional(), projectId: z.string().min(1).optional(), title: z.string().min(1).max(500).optional(), content: z.string().max(200000).optional(), approvalId
}, async (a) => {
  assertProjectAllowed(config, a.projectId); assertApproval('linear.document.save', a.approvalId, config.approvalSecret);
  const clean = { ...a }; delete clean.approvalId;
  return output(await upstream.call('save_document', clean));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
