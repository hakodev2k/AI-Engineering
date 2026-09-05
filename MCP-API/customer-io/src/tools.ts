import { z } from "zod";
import type { Risk } from "./policy.js";

const idType = z.enum(["id", "email", "phone", "cio_id"]);
const customerRef = z.object({ customerId: z.string().min(1).max(300), idType: idType.optional() }).strict();
const intId = z.number().int().positive();
const empty = z.object({}).strict();
const simpleSearch = z.object({
  field: z.string().min(1).max(100),
  operator: z.enum(["eq", "exists"]),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  limit: z.number().int().min(1).max(1000).optional(),
  start: z.string().max(500).optional()
}).strict().superRefine((v, ctx) => { if (v.operator === "eq" && v.value === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "value is required for eq" }); });

export type ToolDef = { name: string; risk: Risk; description: string; schema: z.ZodTypeAny; inputSchema: Record<string, unknown> };
const obj = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });
const customerSchema = obj({ customerId: { type: "string", minLength: 1, maxLength: 300 }, idType: { type: "string", enum: ["id", "email", "phone", "cio_id"] } }, ["customerId"]);

export const TOOLS: ToolDef[] = [
  { name: "customerio.profile.search", risk: "READ", description: "Search profiles using one bounded attribute condition.", schema: simpleSearch, inputSchema: obj({ field: { type: "string" }, operator: { type: "string", enum: ["eq", "exists"] }, value: {}, limit: { type: "integer", minimum: 1, maximum: 1000 }, start: { type: "string" } }, ["field", "operator"]) },
  { name: "customerio.profile.attributes.get", risk: "READ", description: "Read a profile's attributes.", schema: customerRef, inputSchema: customerSchema },
  { name: "customerio.profile.segments.list", risk: "READ", description: "List segments containing a profile.", schema: customerRef, inputSchema: customerSchema },
  { name: "customerio.profile.messages.list", risk: "READ", description: "List deliveries sent to a profile, with bounded time/count filters.", schema: customerRef.extend({ startTs: z.number().int().nonnegative().optional(), endTs: z.number().int().nonnegative().optional(), limit: z.number().int().min(1).max(1000).optional() }).strict(), inputSchema: obj({ ...customerSchema.properties, startTs: { type: "integer", minimum: 0 }, endTs: { type: "integer", minimum: 0 }, limit: { type: "integer", minimum: 1, maximum: 1000 } }, ["customerId"]) },
  { name: "customerio.segment.list", risk: "READ", description: "List workspace segments.", schema: empty, inputSchema: obj({}) },
  { name: "customerio.segment.get", risk: "READ", description: "Get segment metadata.", schema: z.object({ segmentId: intId }).strict(), inputSchema: obj({ segmentId: { type: "integer", minimum: 1 } }, ["segmentId"]) },
  { name: "customerio.segment.members.list", risk: "READ", description: "Page through members of a segment.", schema: z.object({ segmentId: intId, limit: z.number().int().min(1).max(1000).optional(), start: z.string().max(500).optional() }).strict(), inputSchema: obj({ segmentId: { type: "integer", minimum: 1 }, limit: { type: "integer", minimum: 1, maximum: 1000 }, start: { type: "string" } }, ["segmentId"]) },
  { name: "customerio.segment.create_manual", risk: "WRITE", description: "Create an empty manual segment.", schema: z.object({ name: z.string().min(1).max(200), description: z.string().max(1000).optional() }).strict(), inputSchema: obj({ name: { type: "string", minLength: 1, maxLength: 200 }, description: { type: "string", maxLength: 1000 } }, ["name"]) },
  { name: "customerio.automation.list", risk: "READ", description: "List automations/campaigns.", schema: empty, inputSchema: obj({}) },
  { name: "customerio.automation.get", risk: "READ", description: "Get an automation by ID.", schema: z.object({ campaignId: intId }).strict(), inputSchema: obj({ campaignId: { type: "integer", minimum: 1 } }, ["campaignId"]) },
  { name: "customerio.automation.actions.list", risk: "READ", description: "List workflow actions for an automation with cursor pagination.", schema: z.object({ campaignId: intId, start: z.string().max(500).optional() }).strict(), inputSchema: obj({ campaignId: { type: "integer", minimum: 1 }, start: { type: "string" } }, ["campaignId"]) },
  { name: "customerio.newsletter.list", risk: "READ", description: "List one-time newsletters.", schema: empty, inputSchema: obj({}) },
  { name: "customerio.transactional.email.send", risk: "HIGH_RISK", description: "Send a transactional email to an external recipient using a configured transactional message.", schema: z.object({ transactionalMessageId: z.union([z.number().int().positive(), z.string().min(1).max(200)]), to: z.string().email(), identifierType: z.enum(["id", "email", "cio_id"]), identifier: z.string().min(1).max(300), messageData: z.record(z.unknown()).optional(), sendToUnsubscribed: z.boolean().optional(), tracked: z.boolean().optional(), queueDraft: z.boolean().optional() }).strict(), inputSchema: obj({ transactionalMessageId: { oneOf: [{ type: "integer", minimum: 1 }, { type: "string", minLength: 1 }] }, to: { type: "string", format: "email" }, identifierType: { type: "string", enum: ["id", "email", "cio_id"] }, identifier: { type: "string" }, messageData: { type: "object" }, sendToUnsubscribed: { type: "boolean" }, tracked: { type: "boolean" }, queueDraft: { type: "boolean" } }, ["transactionalMessageId", "to", "identifierType", "identifier"]) },
  { name: "customerio.reporting_webhook.list", risk: "READ", description: "List reporting webhook configurations.", schema: empty, inputSchema: obj({}) },
  { name: "customerio.reporting_webhook.create", risk: "HIGH_RISK", description: "Create a reporting webhook to an HTTPS endpoint; may export message/profile event data.", schema: z.object({ name: z.string().min(1).max(200), endpoint: z.string().url().refine(v => new URL(v).protocol === "https:", "endpoint must use HTTPS"), events: z.array(z.string().min(1).max(100)).min(1).max(100), disabled: z.boolean().optional(), fullResolution: z.boolean().optional(), withContent: z.boolean().optional() }).strict(), inputSchema: obj({ name: { type: "string" }, endpoint: { type: "string", format: "uri", pattern: "^https://" }, events: { type: "array", minItems: 1, maxItems: 100, items: { type: "string" } }, disabled: { type: "boolean" }, fullResolution: { type: "boolean" }, withContent: { type: "boolean" } }, ["name", "endpoint", "events"]) },
  { name: "customerio.reporting_webhook.delete", risk: "DESTRUCTIVE", description: "Delete a reporting webhook configuration.", schema: z.object({ webhookId: intId }).strict(), inputSchema: obj({ webhookId: { type: "integer", minimum: 1 } }, ["webhookId"]) }
];
export const TOOL_MAP = new Map(TOOLS.map(tool => [tool.name, tool]));
