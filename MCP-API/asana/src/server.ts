import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { AsanaClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new AsanaClient(config);
const server = new McpServer({ name: 'asana-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Gid = z.string().regex(/^\d+$/).max(64);
const Limit = z.number().int().min(1).max(100).default(50);
const Offset = z.string().min(1).max(500).optional();

server.tool('asana.user.me', 'Get the authenticated Asana user. READ. Scope: users:read.', {},
  async () => json(await client.request('/users/me')));

server.tool('asana.workspace.list', 'List workspaces accessible to the authenticated user. READ. Scope: workspaces:read.', {
  limit: Limit,
  offset: Offset
}, async ({ limit, offset }) => json(await client.request('/workspaces', { query: { limit, offset } })));

server.tool('asana.project.list', 'List projects in a workspace. READ. Scope: projects:read.', {
  workspace_gid: Gid,
  archived: z.boolean().default(false),
  limit: Limit,
  offset: Offset
}, async ({ workspace_gid, archived, limit, offset }) => json(await client.request('/projects', { query: { workspace: workspace_gid, archived, limit, offset } })));

server.tool('asana.project.get', 'Get a project by GID. READ. Scope: projects:read.', { project_gid: Gid },
  async ({ project_gid }) => json(await client.request(`/projects/${project_gid}`)));

server.tool('asana.task.list', 'List tasks in a project or assigned to a user in a workspace. READ. Scope: tasks:read.', {
  project_gid: Gid.optional(),
  workspace_gid: Gid.optional(),
  assignee_gid: z.union([Gid, z.literal('me')]).optional(),
  completed_since: z.string().datetime().optional(),
  limit: Limit,
  offset: Offset
}, async ({ project_gid, workspace_gid, assignee_gid, completed_since, limit, offset }) => {
  if (!project_gid && !(workspace_gid && assignee_gid)) throw new Error('VALIDATION_ERROR: provide project_gid or both workspace_gid and assignee_gid');
  return json(await client.request('/tasks', { query: { project: project_gid, workspace: workspace_gid, assignee: assignee_gid, completed_since, limit, offset } }));
});

server.tool('asana.task.search', 'Search tasks in a workspace using the official advanced-search endpoint. READ; premium access may be required. Scope: tasks:read.', {
  workspace_gid: Gid,
  text: z.string().min(1).max(500),
  assignee_gid: z.union([Gid, z.literal('me')]).optional(),
  completed: z.boolean().optional(),
  due_on: z.string().date().optional(),
  due_on_before: z.string().date().optional(),
  due_on_after: z.string().date().optional(),
  limit: Limit,
  offset: Offset
}, async ({ workspace_gid, text, assignee_gid, completed, due_on, due_on_before, due_on_after, limit, offset }) => json(await client.request(`/workspaces/${workspace_gid}/tasks/search`, { query: {
  'text': text,
  'assignee.any': assignee_gid,
  completed,
  due_on,
  due_on_before,
  due_on_after,
  limit,
  offset
} })));

server.tool('asana.task.get', 'Get a task by GID. READ. Scope: tasks:read.', { task_gid: Gid },
  async ({ task_gid }) => json(await client.request(`/tasks/${task_gid}`)));

server.tool('asana.task.create', 'Create a task. WRITE; explicit operator approval is required by default. Scope: tasks:write.', {
  name: z.string().min(1).max(500),
  workspace_gid: Gid.optional(),
  project_gids: z.array(Gid).min(1).max(20).optional(),
  parent_gid: Gid.optional(),
  assignee_gid: z.union([Gid, z.literal('me')]).optional(),
  notes: z.string().max(10000).optional(),
  due_on: z.string().date().optional(),
  start_on: z.string().date().optional()
}, async ({ name, workspace_gid, project_gids, parent_gid, assignee_gid, notes, due_on, start_on }) => {
  if (!workspace_gid && !project_gids?.length && !parent_gid) throw new Error('VALIDATION_ERROR: task requires workspace_gid, project_gids, or parent_gid');
  assertWriteAllowed(config, 'asana.task.create');
  const data = { name, workspace: workspace_gid, projects: project_gids, parent: parent_gid, assignee: assignee_gid, notes, due_on, start_on };
  return json(await client.request('/tasks', { method: 'POST', body: { data } }));
});

server.tool('asana.task.update', 'Update selected task fields. WRITE; explicit operator approval is required by default. Scope: tasks:write.', {
  task_gid: Gid,
  name: z.string().min(1).max(500).optional(),
  assignee_gid: z.union([Gid, z.literal('me'), z.null()]).optional(),
  notes: z.string().max(10000).optional(),
  due_on: z.union([z.string().date(), z.null()]).optional(),
  start_on: z.union([z.string().date(), z.null()]).optional()
}, async ({ task_gid, assignee_gid, ...fields }) => {
  const data = { ...fields, assignee: assignee_gid };
  if (Object.values(data).every(v => v === undefined)) throw new Error('VALIDATION_ERROR: provide at least one field to update');
  assertWriteAllowed(config, 'asana.task.update');
  return json(await client.request(`/tasks/${task_gid}`, { method: 'PUT', body: { data } }));
});

server.tool('asana.task.complete', 'Mark a task complete or incomplete. WRITE; explicit operator approval is required by default. Scope: tasks:write.', {
  task_gid: Gid,
  completed: z.boolean()
}, async ({ task_gid, completed }) => {
  assertWriteAllowed(config, 'asana.task.complete');
  return json(await client.request(`/tasks/${task_gid}`, { method: 'PUT', body: { data: { completed } } }));
});

server.tool('asana.task.add_project', 'Add or move a task into a project/section. WRITE; explicit operator approval is required by default. Scope: tasks:write.', {
  task_gid: Gid,
  project_gid: Gid,
  section_gid: Gid.optional(),
  insert_before_gid: Gid.optional(),
  insert_after_gid: Gid.optional()
}, async ({ task_gid, project_gid, section_gid, insert_before_gid, insert_after_gid }) => {
  if (insert_before_gid && insert_after_gid) throw new Error('VALIDATION_ERROR: insert_before_gid and insert_after_gid are mutually exclusive');
  assertWriteAllowed(config, 'asana.task.add_project');
  return json(await client.request(`/tasks/${task_gid}/addProject`, { method: 'POST', body: { data: { project: project_gid, section: section_gid, insert_before: insert_before_gid, insert_after: insert_after_gid } } }));
});

server.tool('asana.comment.list', 'List task comments/stories. READ. Scope: stories:read.', {
  task_gid: Gid,
  limit: Limit,
  offset: Offset
}, async ({ task_gid, limit, offset }) => json(await client.request(`/tasks/${task_gid}/stories`, { query: { limit, offset } })));

server.tool('asana.comment.create', 'Add a plain-text comment to a task. WRITE; explicit operator approval is required by default. Scope: stories:write.', {
  task_gid: Gid,
  text: z.string().min(1).max(10000)
}, async ({ task_gid, text }) => {
  assertWriteAllowed(config, 'asana.comment.create');
  return json(await client.request(`/tasks/${task_gid}/stories`, { method: 'POST', body: { data: { text } } }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
