import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.coerce.string().regex(/^\d+$/);
const empty = z.object({}).strict();
const page = z.number().int().min(1).max(1000).optional();
const status = z.enum(["active", "archived", "trashed"]).optional();
const html = z.string().max(20000).optional();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional();
const obj = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; inputSchema: Record<string, unknown> };
export const TOOLS: ToolDef[] = [
  { name: "basecamp.profile.get", description: "Read the authenticated Basecamp profile.", risk: "READ", schema: empty, inputSchema: obj({}) },
  { name: "basecamp.project.list", description: "List projects visible to the authenticated user.", risk: "READ", schema: z.object({ status, page }).strict(), inputSchema: obj({ status: { type: "string", enum: ["active","archived","trashed"] }, page: { type: "integer", minimum: 1, maximum: 1000 } }) },
  { name: "basecamp.project.get", description: "Get project metadata and dock/tool IDs.", risk: "READ", schema: z.object({ projectId: id }).strict(), inputSchema: obj({ projectId: { type: "string", pattern: "^\\d+$" } }, ["projectId"]) },
  { name: "basecamp.people.list", description: "List people visible in the account.", risk: "READ", schema: z.object({ page }).strict(), inputSchema: obj({ page: { type: "integer", minimum: 1, maximum: 1000 } }) },
  { name: "basecamp.project.people.list", description: "List people on a project.", risk: "READ", schema: z.object({ projectId: id, page }).strict(), inputSchema: obj({ projectId: { type: "string" }, page: { type: "integer", minimum: 1, maximum: 1000 } }, ["projectId"]) },
  { name: "basecamp.todolist.get", description: "Get a to-do list by ID.", risk: "READ", schema: z.object({ todolistId: id }).strict(), inputSchema: obj({ todolistId: { type: "string" } }, ["todolistId"]) },
  { name: "basecamp.todo.list", description: "List to-dos in a to-do list.", risk: "READ", schema: z.object({ todolistId: id, status, completed: z.boolean().optional(), page }).strict(), inputSchema: obj({ todolistId: { type: "string" }, status: { type: "string", enum: ["active","archived","trashed"] }, completed: { type: "boolean" }, page: { type: "integer", minimum: 1, maximum: 1000 } }, ["todolistId"]) },
  { name: "basecamp.todo.get", description: "Get a to-do by ID.", risk: "READ", schema: z.object({ todoId: id }).strict(), inputSchema: obj({ todoId: { type: "string" } }, ["todoId"]) },
  { name: "basecamp.todo.create", description: "Create a to-do in a to-do list.", risk: "WRITE", schema: z.object({ todolistId: id, content: z.string().min(1).max(500), description: html, assigneeIds: z.array(id).max(100).optional(), dueOn: date, startsOn: date, notify: z.boolean().optional() }).strict(), inputSchema: obj({ todolistId: { type: "string" }, content: { type: "string", minLength: 1, maxLength: 500 }, description: { type: "string", maxLength: 20000 }, assigneeIds: { type: "array", maxItems: 100, items: { type: "string" } }, dueOn: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }, startsOn: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }, notify: { type: "boolean" } }, ["todolistId","content"]) },
  { name: "basecamp.todo.complete", description: "Mark a to-do completed.", risk: "WRITE", schema: z.object({ todoId: id }).strict(), inputSchema: obj({ todoId: { type: "string" } }, ["todoId"]) },
  { name: "basecamp.todo.uncomplete", description: "Mark a to-do uncompleted.", risk: "WRITE", schema: z.object({ todoId: id }).strict(), inputSchema: obj({ todoId: { type: "string" } }, ["todoId"]) },
  { name: "basecamp.message.list", description: "List messages on a message board.", risk: "READ", schema: z.object({ messageBoardId: id, sort: z.enum(["created_at","updated_at"]).optional(), direction: z.enum(["asc","desc"]).optional(), page }).strict(), inputSchema: obj({ messageBoardId: { type: "string" }, sort: { type: "string", enum: ["created_at","updated_at"] }, direction: { type: "string", enum: ["asc","desc"] }, page: { type: "integer", minimum: 1, maximum: 1000 } }, ["messageBoardId"]) },
  { name: "basecamp.message.get", description: "Get a message by ID.", risk: "READ", schema: z.object({ messageId: id }).strict(), inputSchema: obj({ messageId: { type: "string" } }, ["messageId"]) },
  { name: "basecamp.message.draft.create", description: "Create a draft message without publishing or notifying subscribers.", risk: "WRITE", schema: z.object({ messageBoardId: id, subject: z.string().min(1).max(500), content: html, visibleToClients: z.boolean().optional() }).strict(), inputSchema: obj({ messageBoardId: { type: "string" }, subject: { type: "string", minLength: 1, maxLength: 500 }, content: { type: "string", maxLength: 20000 }, visibleToClients: { type: "boolean" } }, ["messageBoardId","subject"]) },
  { name: "basecamp.message.publish", description: "Publish an existing draft message; may notify project subscribers.", risk: "HIGH_RISK", schema: z.object({ messageId: id }).strict(), inputSchema: obj({ messageId: { type: "string" } }, ["messageId"]) },
  { name: "basecamp.comment.list", description: "List comments on a recording such as a to-do or message.", risk: "READ", schema: z.object({ recordingId: id, page }).strict(), inputSchema: obj({ recordingId: { type: "string" }, page: { type: "integer", minimum: 1, maximum: 1000 } }, ["recordingId"]) },
  { name: "basecamp.comment.create", description: "Post a comment to a recording; this sends an external project communication.", risk: "HIGH_RISK", schema: z.object({ recordingId: id, content: z.string().min(1).max(20000) }).strict(), inputSchema: obj({ recordingId: { type: "string" }, content: { type: "string", minLength: 1, maxLength: 20000 } }, ["recordingId","content"]) }
];
export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
