import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ClickUpClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new ClickUpClient(config);
const server = new McpServer({ name: 'clickup-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });

const NumericId = z.union([z.string().regex(/^\d+$/), z.number().int().positive()]).transform(String);
const TaskId = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);

server.tool('clickup.user.get', 'Get the authenticated ClickUp user. READ.', {},
  async () => json(await client.request('/user')));

server.tool('clickup.workspace.list', 'List Workspaces authorized for the configured token. READ.', {},
  async () => json(await client.request('/team')));

server.tool('clickup.space.list', 'List Spaces in a Workspace. READ.', {
  workspace_id: NumericId,
  archived: z.boolean().default(false)
}, async ({ workspace_id, archived }) => json(await client.request(`/team/${workspace_id}/space`, { query: { archived } })));

server.tool('clickup.folder.list', 'List Folders in a Space. READ.', {
  space_id: NumericId,
  archived: z.boolean().default(false)
}, async ({ space_id, archived }) => json(await client.request(`/space/${space_id}/folder`, { query: { archived } })));

server.tool('clickup.list.folderless.list', 'List Lists directly under a Space. READ.', {
  space_id: NumericId,
  archived: z.boolean().default(false)
}, async ({ space_id, archived }) => json(await client.request(`/space/${space_id}/list`, { query: { archived } })));

server.tool('clickup.list.in_folder.list', 'List Lists in a Folder. READ.', {
  folder_id: NumericId,
  archived: z.boolean().default(false)
}, async ({ folder_id, archived }) => json(await client.request(`/folder/${folder_id}/list`, { query: { archived } })));

server.tool('clickup.task.list', 'List tasks in a List with bounded pagination. READ.', {
  list_id: NumericId,
  page: z.number().int().min(0).max(10000).default(0),
  archived: z.boolean().default(false),
  include_closed: z.boolean().default(false),
  subtasks: z.boolean().default(false),
  order_by: z.enum(['id', 'created', 'updated', 'due_date']).optional(),
  reverse: z.boolean().optional(),
  due_date_gt: z.number().int().nonnegative().optional(),
  due_date_lt: z.number().int().nonnegative().optional()
}, async ({ list_id, ...query }) => json(await client.request(`/list/${list_id}/task`, { query })));

server.tool('clickup.task.get', 'Get one task visible to the authenticated user. READ.', {
  task_id: TaskId,
  include_subtasks: z.boolean().default(false),
  include_markdown_description: z.boolean().default(true)
}, async ({ task_id, ...query }) => json(await client.request(`/task/${encodeURIComponent(task_id)}`, { query })));

const TaskWriteFields = {
  name: z.string().min(1).max(500).optional(),
  description: z.string().max(20000).optional(),
  status: z.string().min(1).max(100).optional(),
  priority: z.number().int().min(1).max(4).nullable().optional(),
  due_date: z.number().int().nonnegative().optional(),
  due_date_time: z.boolean().optional(),
  start_date: z.number().int().nonnegative().optional(),
  start_date_time: z.boolean().optional(),
  time_estimate: z.number().int().nonnegative().optional(),
  assignees: z.array(z.number().int().positive()).max(100).optional(),
  tags: z.array(z.string().min(1).max(100)).max(100).optional()
};

server.tool('clickup.task.create', 'Create a task in a List. WRITE; operator approval required by default.', {
  list_id: NumericId,
  name: z.string().min(1).max(500),
  description: z.string().max(20000).optional(),
  status: z.string().min(1).max(100).optional(),
  priority: z.number().int().min(1).max(4).nullable().optional(),
  due_date: z.number().int().nonnegative().optional(),
  due_date_time: z.boolean().optional(),
  start_date: z.number().int().nonnegative().optional(),
  start_date_time: z.boolean().optional(),
  time_estimate: z.number().int().nonnegative().optional(),
  assignees: z.array(z.number().int().positive()).max(100).optional(),
  tags: z.array(z.string().min(1).max(100)).max(100).optional()
}, async ({ list_id, ...body }) => {
  assertWriteAllowed(config, 'clickup.task.create');
  return json(await client.request(`/list/${list_id}/task`, { method: 'POST', body }));
});

server.tool('clickup.task.update', 'Update selected fields on an existing task. WRITE; operator approval required by default.', {
  task_id: TaskId,
  ...TaskWriteFields
}, async ({ task_id, ...body }) => {
  if (Object.keys(body).length === 0) throw new Error('VALIDATION_ERROR: at least one task field is required');
  assertWriteAllowed(config, 'clickup.task.update');
  return json(await client.request(`/task/${encodeURIComponent(task_id)}`, { method: 'PUT', body }));
});

server.tool('clickup.task.delete', 'Delete a task. DESTRUCTIVE; explicit approval and destructive opt-in required.', {
  task_id: TaskId
}, async ({ task_id }) => {
  assertWriteAllowed(config, 'clickup.task.delete', true);
  return json(await client.request(`/task/${encodeURIComponent(task_id)}`, { method: 'DELETE' }));
});

server.tool('clickup.comment.list', 'List task comments, newest first, with cursor-style pagination. READ.', {
  task_id: TaskId,
  start: z.number().int().nonnegative().optional(),
  start_id: z.string().min(1).max(128).optional()
}, async ({ task_id, start, start_id }) => {
  if ((start === undefined) !== (start_id === undefined)) throw new Error('VALIDATION_ERROR: start and start_id must be provided together');
  return json(await client.request(`/task/${encodeURIComponent(task_id)}/comment`, { query: { start, start_id } }));
});

server.tool('clickup.comment.create', 'Post a comment to a task. WRITE/external communication; operator approval required by default.', {
  task_id: TaskId,
  comment_text: z.string().min(1).max(10000),
  notify_all: z.boolean().default(false),
  assignee: z.number().int().positive().optional()
}, async ({ task_id, ...body }) => {
  assertWriteAllowed(config, 'clickup.comment.create');
  return json(await client.request(`/task/${encodeURIComponent(task_id)}/comment`, { method: 'POST', body }));
});

await server.connect(new StdioServerTransport());
