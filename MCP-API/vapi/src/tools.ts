import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { requireApproval, type Risk } from "./policy.js";
import type { Upstream } from "./upstream.js";

export interface ToolSpec {
  name: string;
  upstream: string;
  description: string;
  risk: Risk;
}

export const TOOL_SPECS: ToolSpec[] = [
  { name: "vapi.assistant.list", upstream: "list_assistants", description: "List Vapi assistants.", risk: "READ" },
  { name: "vapi.assistant.get", upstream: "get_assistant", description: "Get one Vapi assistant by UUID.", risk: "READ" },
  { name: "vapi.assistant.create", upstream: "create_assistant", description: "Create a Vapi assistant using a narrow reviewed subset of the official MCP schema.", risk: "WRITE" },
  { name: "vapi.call.list", upstream: "list_calls", description: "List and filter Vapi calls.", risk: "READ" },
  { name: "vapi.call.get", upstream: "get_call", description: "Get call status, result and available artifacts by UUID.", risk: "READ" },
  { name: "vapi.call.create", upstream: "create_call", description: "Initiate or schedule an outbound phone call. This sends an external communication and requires explicit high-risk approval.", risk: "HIGH_RISK" },
  { name: "vapi.phone_number.list", upstream: "list_phone_numbers", description: "List Vapi phone numbers.", risk: "READ" },
  { name: "vapi.phone_number.get", upstream: "get_phone_number", description: "Get one Vapi phone number by UUID.", risk: "READ" },
  { name: "vapi.tool.list", upstream: "list_tools", description: "List tools configured in Vapi.", risk: "READ" },
  { name: "vapi.tool.get", upstream: "get_tool", description: "Get one configured Vapi tool by UUID.", risk: "READ" }
];

const uuid = z.string().uuid();
const approval = z.enum(["approved", "approved-high-risk"]).optional();

const schemas = {
  "vapi.assistant.list": z.object({ limit: z.number().int().min(1).max(1000).optional() }).strict(),
  "vapi.assistant.get": z.object({ id: uuid }).strict(),
  "vapi.assistant.create": z.object({
    name: z.string().min(1).max(40),
    firstMessage: z.string().min(1).max(2000).optional(),
    firstMessageMode: z.enum([
      "assistant-speaks-first",
      "assistant-waits-for-user",
      "assistant-speaks-first-with-model-generated-message"
    ]).optional(),
    instructions: z.string().min(1).max(12000).optional(),
    toolIds: z.array(uuid).max(50).optional(),
    approval
  }).strict(),
  "vapi.call.list": z.object({
    assistantId: uuid.optional(),
    phoneNumberId: uuid.optional(),
    limit: z.number().int().min(1).max(1000).optional(),
    createdAtGe: z.string().datetime().optional(),
    createdAtLe: z.string().datetime().optional()
  }).strict(),
  "vapi.call.get": z.object({ id: uuid }).strict(),
  "vapi.call.create": z.object({
    assistantId: uuid,
    phoneNumberId: uuid,
    customerNumber: z.string().regex(/^\+[1-9]\d{7,14}$/, "customerNumber must be E.164"),
    scheduledAt: z.string().datetime().optional(),
    approval
  }).strict(),
  "vapi.phone_number.list": z.object({ limit: z.number().int().min(1).max(1000).optional() }).strict(),
  "vapi.phone_number.get": z.object({ id: uuid }).strict(),
  "vapi.tool.list": z.object({ limit: z.number().int().min(1).max(1000).optional() }).strict(),
  "vapi.tool.get": z.object({ id: uuid }).strict()
} as const;

function mapArgs(spec: ToolSpec, input: Record<string, unknown>): Record<string, unknown> {
  const args = { ...input };
  delete args.approval;

  if (spec.name === "vapi.assistant.get") {
    return { assistantId: args.id };
  }
  if (spec.name === "vapi.call.get") {
    return { callId: args.id };
  }
  if (spec.name === "vapi.phone_number.get") {
    return { phoneNumberId: args.id };
  }
  if (spec.name === "vapi.tool.get") {
    return { toolId: args.id };
  }
  if (spec.name === "vapi.call.create") {
    const customer = { number: args.customerNumber };
    delete args.customerNumber;
    args.customer = customer;
  }
  return args;
}

function safeJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => {
    if (typeof item === "string" && item.length > 200_000) return `${item.slice(0, 200_000)}…[truncated]`;
    return item;
  }, 2);
}

export async function executeTool(spec: ToolSpec, input: Record<string, unknown>, upstream: Upstream, config: Config): Promise<unknown> {
  const parsed = schemas[spec.name as keyof typeof schemas].parse(input) as Record<string, unknown>;
  requireApproval(spec.risk, parsed.approval as string | undefined, config);
  return upstream.callTool(spec.upstream, mapArgs(spec, parsed));
}

export function registerTools(server: McpServer, upstream: Upstream, config: Config): void {
  for (const spec of TOOL_SPECS) {
    const schema = schemas[spec.name as keyof typeof schemas];
    server.tool(spec.name, spec.description, schema.shape, async (input) => {
      const result = await executeTool(spec, input as Record<string, unknown>, upstream, config);
      return {
        content: [{
          type: "text",
          text: safeJson({ provider: "vapi", tool: spec.name, risk: spec.risk, untrusted_provider_content: true, result })
        }]
      };
    });
  }
}
