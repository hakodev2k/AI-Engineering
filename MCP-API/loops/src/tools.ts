import { z } from "zod";
import type { Risk } from "./policy.js";

const approval = z.object({ confirmed: z.literal(true), reason: z.string().min(3).max(500) });
const email = z.string().email().max(320);
const idempotency = z.string().min(1).max(100);

export type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  inputSchema: Record<string, unknown>;
  parse: (input: unknown) => Record<string, unknown>;
};

function def(name: string, description: string, risk: Risk, schema: z.ZodTypeAny, inputSchema: Record<string, unknown>): ToolDef {
  return { name, description, risk, inputSchema, parse: (input) => schema.parse(input ?? {}) as Record<string, unknown> };
}

const approvalProp = { approval: { type: "object", additionalProperties: false, properties: { confirmed: { type: "boolean", const: true }, reason: { type: "string", minLength: 3, maxLength: 500 } }, required: ["confirmed", "reason"] } };

export const TOOLS: ToolDef[] = [
  def("loops.contact.find", "Find a contact by email or userId.", "READ",
    z.object({ email: email.optional(), userId: z.string().min(1).max(200).optional() }).refine(v => !!v.email !== !!v.userId, "Provide exactly one of email or userId"),
    { type: "object", additionalProperties: false, properties: { email: { type: "string", format: "email", maxLength: 320 }, userId: { type: "string", minLength: 1, maxLength: 200 } } }),
  def("loops.contact.create", "Create a Loops contact and optional mailing-list memberships.", "WRITE",
    z.object({ email, userId: z.string().max(200).optional(), firstName: z.string().max(200).optional(), lastName: z.string().max(200).optional(), subscribed: z.boolean().optional(), mailingLists: z.record(z.boolean()).optional(), properties: z.record(z.unknown()).optional(), approval }),
    { type: "object", additionalProperties: false, properties: { email: { type: "string", format: "email" }, userId: { type: "string" }, firstName: { type: "string" }, lastName: { type: "string" }, subscribed: { type: "boolean" }, mailingLists: { type: "object", additionalProperties: { type: "boolean" } }, properties: { type: "object" }, ...approvalProp }, required: ["email", "approval"] }),
  def("loops.contact.update", "Update a contact by email or userId, including properties and mailing-list membership.", "WRITE",
    z.object({ email: email.optional(), userId: z.string().min(1).max(200).optional(), firstName: z.string().max(200).optional(), lastName: z.string().max(200).optional(), subscribed: z.boolean().optional(), mailingLists: z.record(z.boolean()).optional(), properties: z.record(z.unknown()).optional(), approval }).refine(v => !!v.email || !!v.userId, "email or userId is required"),
    { type: "object", additionalProperties: false, properties: { email: { type: "string", format: "email" }, userId: { type: "string" }, firstName: { type: "string" }, lastName: { type: "string" }, subscribed: { type: "boolean" }, mailingLists: { type: "object", additionalProperties: { type: "boolean" } }, properties: { type: "object" }, ...approvalProp }, required: ["approval"] }),
  def("loops.contact.delete", "Delete a contact. Destructive and disabled by default.", "DESTRUCTIVE",
    z.object({ email: email.optional(), userId: z.string().min(1).max(200).optional(), approval }).refine(v => !!v.email !== !!v.userId, "Provide exactly one of email or userId"),
    { type: "object", additionalProperties: false, properties: { email: { type: "string", format: "email" }, userId: { type: "string" }, ...approvalProp }, required: ["approval"] }),
  def("loops.mailing_list.list", "List mailing lists and IDs used for contact membership.", "READ", z.object({}), { type: "object", additionalProperties: false, properties: {} }),
  def("loops.event.send", "Send an event that can update activity or trigger published workflows. This can cause external email and requires approval.", "HIGH_RISK",
    z.object({ eventName: z.string().min(1).max(200), email: email.optional(), userId: z.string().max(200).optional(), eventProperties: z.record(z.unknown()).optional(), contactProperties: z.record(z.unknown()).optional(), mailingLists: z.record(z.boolean()).optional(), idempotencyKey: idempotency.optional(), approval }).refine(v => !!v.email || !!v.userId, "email or userId is required"),
    { type: "object", additionalProperties: false, properties: { eventName: { type: "string", minLength: 1 }, email: { type: "string", format: "email" }, userId: { type: "string" }, eventProperties: { type: "object" }, contactProperties: { type: "object" }, mailingLists: { type: "object", additionalProperties: { type: "boolean" } }, idempotencyKey: { type: "string", maxLength: 100 }, ...approvalProp }, required: ["eventName", "approval"] }),
  def("loops.transactional_email.list", "List published transactional email templates.", "READ", z.object({ perPage: z.number().int().min(1).max(100).optional(), cursor: z.string().max(500).optional() }), { type: "object", additionalProperties: false, properties: { perPage: { type: "integer", minimum: 1, maximum: 100 }, cursor: { type: "string", maxLength: 500 } } }),
  def("loops.transactional_email.get", "Get a transactional email template by transactionalId.", "READ", z.object({ transactionalId: z.string().uuid() }), { type: "object", additionalProperties: false, properties: { transactionalId: { type: "string", format: "uuid" } }, required: ["transactionalId"] }),
  def("loops.transactional_email.send", "Send a published transactional email. External message; explicit approval required.", "HIGH_RISK",
    z.object({ transactionalId: z.string().uuid(), email, dataVariables: z.record(z.unknown()).optional(), addToAudience: z.boolean().optional(), idempotencyKey: idempotency.optional(), approval }),
    { type: "object", additionalProperties: false, properties: { transactionalId: { type: "string", format: "uuid" }, email: { type: "string", format: "email" }, dataVariables: { type: "object" }, addToAudience: { type: "boolean" }, idempotencyKey: { type: "string", maxLength: 100 }, ...approvalProp }, required: ["transactionalId", "email", "approval"] }),
  def("loops.workflow.list", "List workflows.", "READ", z.object({}), { type: "object", additionalProperties: false, properties: {} }),
  def("loops.workflow.get", "Read a workflow and its current revision by workflowId.", "READ", z.object({ workflowId: z.string().min(1).max(200) }), { type: "object", additionalProperties: false, properties: { workflowId: { type: "string" } }, required: ["workflowId"] }),
  def("loops.workflow.create", "Create a workflow draft using the official Workflows API.", "WRITE", z.object({ workflow: z.record(z.unknown()), approval }), { type: "object", additionalProperties: false, properties: { workflow: { type: "object" }, ...approvalProp }, required: ["workflow", "approval"] }),
  def("loops.workflow.update", "Update a workflow. Include the revision last read to preserve Loops revision-safety semantics.", "HIGH_RISK", z.object({ workflowId: z.string().min(1).max(200), revision: z.union([z.string(), z.number()]), changes: z.record(z.unknown()), approval }), { type: "object", additionalProperties: false, properties: { workflowId: { type: "string" }, revision: { oneOf: [{ type: "string" }, { type: "number" }] }, changes: { type: "object" }, ...approvalProp }, required: ["workflowId", "revision", "changes", "approval"] })
];

export const TOOL_BY_NAME = new Map(TOOLS.map(t => [t.name, t]));
