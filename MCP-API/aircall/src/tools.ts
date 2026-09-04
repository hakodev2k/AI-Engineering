import { z } from "zod";
import type { Risk } from "./policy.js";

export type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  approval: boolean;
  inputSchema: Record<string, unknown>;
  parse: (input: unknown) => Record<string, unknown>;
};

const approvalSchema = z.object({ confirmed: z.literal(true), reason: z.string().min(3).max(500) });
const pageSchema = { page: z.number().int().min(1).optional(), per_page: z.number().int().min(1).max(50).optional() };
const obj = (shape: z.ZodRawShape) => z.object(shape).strict();
const jsonSchema = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, ...(required.length ? { required } : {}) });
const approvalProperty = { type: "object", additionalProperties: false, properties: { confirmed: { type: "boolean", const: true }, reason: { type: "string", minLength: 3, maxLength: 500 } }, required: ["confirmed", "reason"] };

export const tools: ToolDef[] = [
  {
    name: "aircall.call.list", description: "List historical Aircall calls with bounded pagination and optional Unix timestamp filters.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ page: { type: "integer", minimum: 1 }, per_page: { type: "integer", minimum: 1, maximum: 50 }, from: { type: "integer", minimum: 0 }, to: { type: "integer", minimum: 0 }, order: { type: "string", enum: ["asc", "desc"] } }),
    parse: (v) => obj({ ...pageSchema, from: z.number().int().min(0).optional(), to: z.number().int().min(0).optional(), order: z.enum(["asc", "desc"]).optional() }).parse(v)
  },
  {
    name: "aircall.call.get", description: "Read one Aircall call by numeric ID.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ call_id: { type: "integer", minimum: 1 } }, ["call_id"]),
    parse: (v) => obj({ call_id: z.number().int().positive() }).parse(v)
  },
  {
    name: "aircall.user.list", description: "List Aircall users and their current availability metadata.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ page: { type: "integer", minimum: 1 }, per_page: { type: "integer", minimum: 1, maximum: 50 } }),
    parse: (v) => obj(pageSchema).parse(v)
  },
  {
    name: "aircall.user.get", description: "Read one Aircall user by numeric ID.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ user_id: { type: "integer", minimum: 1 } }, ["user_id"]),
    parse: (v) => obj({ user_id: z.number().int().positive() }).parse(v)
  },
  {
    name: "aircall.user.availability.list", description: "Read the account-wide snapshot of Aircall user availability.", risk: "READ", approval: false,
    inputSchema: jsonSchema({}), parse: (v) => obj({}).parse(v)
  },
  {
    name: "aircall.team.list", description: "List Aircall teams and memberships.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ page: { type: "integer", minimum: 1 }, per_page: { type: "integer", minimum: 1, maximum: 50 } }),
    parse: (v) => obj(pageSchema).parse(v)
  },
  {
    name: "aircall.number.list", description: "List Aircall phone numbers visible to the authenticated integration.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ page: { type: "integer", minimum: 1 }, per_page: { type: "integer", minimum: 1, maximum: 50 } }),
    parse: (v) => obj(pageSchema).parse(v)
  },
  {
    name: "aircall.tag.list", description: "List Aircall call tags for categorization and reporting workflows.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ page: { type: "integer", minimum: 1 }, per_page: { type: "integer", minimum: 1, maximum: 50 } }),
    parse: (v) => obj(pageSchema).parse(v)
  },
  {
    name: "aircall.webhook.list", description: "List configured Aircall webhooks.", risk: "READ", approval: false,
    inputSchema: jsonSchema({ page: { type: "integer", minimum: 1 }, per_page: { type: "integer", minimum: 1, maximum: 50 } }),
    parse: (v) => obj(pageSchema).parse(v)
  },
  {
    name: "aircall.dial.prepare", description: "Pre-fill a destination number in a specific user's Aircall Phone app. It does not automatically start the call.", risk: "WRITE", approval: true,
    inputSchema: jsonSchema({ user_id: { type: "integer", minimum: 1 }, phone_number: { type: "string", minLength: 3, maxLength: 32, pattern: "^\\+?[0-9 ()-]+$" }, approval: approvalProperty }, ["user_id", "phone_number", "approval"]),
    parse: (v) => obj({ user_id: z.number().int().positive(), phone_number: z.string().min(3).max(32).regex(/^\+?[0-9 ()-]+$/), approval: approvalSchema }).parse(v)
  },
  {
    name: "aircall.webhook.create", description: "Register a webhook to a public HTTPS endpoint for explicitly selected Aircall event types.", risk: "HIGH_RISK", approval: true,
    inputSchema: jsonSchema({ custom_name: { type: "string", minLength: 1, maxLength: 100 }, url: { type: "string", format: "uri", pattern: "^https://" }, events: { type: "array", minItems: 1, maxItems: 30, uniqueItems: true, items: { type: "string", minLength: 3, maxLength: 80 } }, approval: approvalProperty }, ["custom_name", "url", "events", "approval"]),
    parse: (v) => obj({ custom_name: z.string().min(1).max(100), url: z.string().url().refine((u) => u.startsWith("https://"), "Webhook URL must use HTTPS"), events: z.array(z.string().min(3).max(80)).min(1).max(30), approval: approvalSchema }).parse(v)
  },
  {
    name: "aircall.webhook.delete", description: "Delete an Aircall webhook by ID. Destructive and disabled by default.", risk: "DESTRUCTIVE", approval: true,
    inputSchema: jsonSchema({ webhook_id: { type: "integer", minimum: 1 }, approval: approvalProperty }, ["webhook_id", "approval"]),
    parse: (v) => obj({ webhook_id: z.number().int().positive(), approval: approvalSchema }).parse(v)
  }
];

export const toolMap = new Map(tools.map((t) => [t.name, t]));
