import type { Risk } from "./policy.js";

export type ToolSpec = {
  name: string;
  description: string;
  risk: Risk;
  inputSchema: Record<string, unknown>;
};

const id = { type: "string", minLength: 1, maxLength: 128, pattern: "^[A-Za-z0-9_-]+$" };
const dbName = { type: "string", minLength: 1, maxLength: 64, pattern: "^[a-z0-9-]+$" };
const approval = {
  type: "object",
  additionalProperties: false,
  properties: {
    confirmed: { type: "boolean", const: true },
    reason: { type: "string", minLength: 3, maxLength: 500 }
  },
  required: ["confirmed", "reason"]
};

export const TOOLS: ToolSpec[] = [
  { name: "turso.organization.list", description: "List organizations available to the authenticated Turso platform token.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: {} } },
  { name: "turso.location.list", description: "List Turso locations available for groups and replicas.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: {} } },
  { name: "turso.group.list", description: "List database groups in the configured organization.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: {} } },
  { name: "turso.group.configuration.get", description: "Read delete-protection configuration for a group.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: { group: id }, required: ["group"] } },
  { name: "turso.database.list", description: "List databases, optionally filtered by group, schema parent, or branch parent ID.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: { group: id, schema: dbName, parent: id } } },
  { name: "turso.database.get", description: "Retrieve metadata for one database.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: { database: dbName }, required: ["database"] } },
  { name: "turso.database.usage.get", description: "Retrieve database usage for an optional ISO-8601 time range.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: { database: dbName, from: { type: "string", format: "date-time" }, to: { type: "string", format: "date-time" } }, required: ["database"] } },
  { name: "turso.organization.members.list", description: "List members of the configured organization.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: {} } },
  { name: "turso.organization.member.get", description: "Retrieve one organization member by username.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: { username: id }, required: ["username"] } },
  { name: "turso.organization.plans.list", description: "List Turso plans and quotas visible for the configured organization.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: {} } },
  { name: "turso.audit_log.list", description: "List organization audit logs with bounded pagination.", risk: "READ", inputSchema: { type: "object", additionalProperties: false, properties: { page: { type: "integer", minimum: 1, maximum: 10000 }, page_size: { type: "integer", minimum: 1, maximum: 100 } } } },
  { name: "turso.group.create", description: "Create a Turso database group in a primary location. Requires explicit approval and write enablement.", risk: "WRITE", inputSchema: { type: "object", additionalProperties: false, properties: { name: id, location: id, approval }, required: ["name", "location", "approval"] } },
  { name: "turso.database.create", description: "Create a Turso database in an existing group. Requires explicit approval and write enablement.", risk: "WRITE", inputSchema: { type: "object", additionalProperties: false, properties: { name: dbName, group: id, size_limit: { type: "string", minLength: 1, maxLength: 32 }, approval }, required: ["name", "group", "approval"] } }
];
