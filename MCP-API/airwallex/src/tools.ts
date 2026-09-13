import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AirwallexConfig } from "./config.js";
import type { AirwallexClient } from "./client.js";
import { enforceRisk, TOOL_RISK, type Risk } from "./policy.js";

const pageSize = z.number().int().min(1).max(2000).optional();
const isoDateTime = z.string().datetime().optional();
const id = z.string().min(1).max(200);
const accountType = z.enum(["cash", "yield", "credit"]).optional();
const beneficiaryPayload = z.object({
  beneficiary: z.object({
    entity_type: z.enum(["PERSONAL", "COMPANY"]),
    type: z.enum(["BANK_ACCOUNT", "DIGITAL_WALLET"]).optional()
  }).passthrough()
}).passthrough();
const transferPayload = z.object({
  request_id: z.string().min(8).max(128),
  transfer_amount: z.number().positive(),
  transfer_currency: z.string().regex(/^[A-Z]{3}$/),
  beneficiary_id: z.string().min(1).max(200).optional()
}).passthrough();

interface ToolSpec { name: keyof typeof TOOL_RISK; description: string; risk: Risk; }
export const TOOL_SPECS: ToolSpec[] = [
  { name: "airwallex.balance.current", description: "Read current available, pending, reserved and total balances by currency.", risk: "READ" },
  { name: "airwallex.balance.history", description: "Read paginated balance activity for reconciliation.", risk: "READ" },
  { name: "airwallex.beneficiary.list", description: "List saved payout beneficiaries using scoped filters.", risk: "READ" },
  { name: "airwallex.beneficiary.get", description: "Get one beneficiary by ID.", risk: "READ" },
  { name: "airwallex.beneficiary.validate", description: "Validate beneficiary details against Airwallex dynamic requirements without saving them.", risk: "READ" },
  { name: "airwallex.beneficiary.create", description: "Create a saved beneficiary. High risk because it changes payout destinations.", risk: "HIGH_RISK" },
  { name: "airwallex.beneficiary.update", description: "Update a saved beneficiary. High risk because it changes payout destinations.", risk: "HIGH_RISK" },
  { name: "airwallex.transfer.list", description: "List transfers with optional status, currency, beneficiary and date filters.", risk: "READ" },
  { name: "airwallex.transfer.get", description: "Get one transfer by ID.", risk: "READ" },
  { name: "airwallex.transfer.validate", description: "Validate transfer parameters without creating a transfer.", risk: "READ" },
  { name: "airwallex.transfer.create", description: "Create a money transfer. Requires explicit operator enablement.", risk: "HIGH_RISK" },
  { name: "airwallex.transfer.cancel", description: "Cancel an eligible transfer. Destructive and disabled by default.", risk: "DESTRUCTIVE" },
  { name: "airwallex.webhook.list", description: "List configured Airwallex webhooks and subscribed events.", risk: "READ" }
];

const schemas = {
  "airwallex.balance.current": z.object({ account_type: accountType }).strict(),
  "airwallex.balance.history": z.object({ account_type: accountType, currency: z.string().regex(/^[A-Z]{3}$/).optional(), from_post_at: isoDateTime, to_post_at: isoDateTime, page: z.string().max(500).optional(), page_size: pageSize, request_id: z.string().max(128).optional() }).strict(),
  "airwallex.beneficiary.list": z.object({ name: z.string().max(200).optional(), company_name: z.string().max(200).optional(), nick_name: z.string().max(200).optional(), entity_type: z.enum(["PERSONAL", "COMPANY"]).optional(), from_date: z.string().max(40).optional(), to_date: z.string().max(40).optional(), page_num: z.number().int().min(0).optional(), page_size: z.number().int().min(1).max(1000).optional() }).strict(),
  "airwallex.beneficiary.get": z.object({ id }).strict(),
  "airwallex.beneficiary.validate": beneficiaryPayload,
  "airwallex.beneficiary.create": beneficiaryPayload,
  "airwallex.beneficiary.update": z.object({ id, beneficiary: beneficiaryPayload.shape.beneficiary }).passthrough(),
  "airwallex.transfer.list": z.object({ beneficiary_id: z.string().max(200).optional(), status: z.string().max(80).optional(), transfer_currency: z.string().regex(/^[A-Z]{3}$/).optional(), from_created_at: isoDateTime, to_created_at: isoDateTime, page: z.string().max(500).optional(), page_size: pageSize, request_id: z.string().max(128).optional() }).strict(),
  "airwallex.transfer.get": z.object({ id }).strict(),
  "airwallex.transfer.validate": transferPayload,
  "airwallex.transfer.create": transferPayload,
  "airwallex.transfer.cancel": z.object({ id }).strict(),
  "airwallex.webhook.list": z.object({ page: z.string().max(500).optional(), page_size: z.number().int().min(1).max(100).optional() }).strict()
} as const;

async function execute(client: AirwallexClient, name: keyof typeof TOOL_RISK, input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "airwallex.balance.current": return client.request("GET", "/api/v1/balances/current", { query: input });
    case "airwallex.balance.history": return client.request("GET", "/api/v1/balances/history", { query: input });
    case "airwallex.beneficiary.list": return client.request("GET", "/api/v1/beneficiaries", { query: input });
    case "airwallex.beneficiary.get": return client.request("GET", `/api/v1/beneficiaries/${encodeURIComponent(String(input.id))}`);
    case "airwallex.beneficiary.validate": return client.request("POST", "/api/v1/beneficiaries/validate", { body: input, retryable: true });
    case "airwallex.beneficiary.create": return client.request("POST", "/api/v1/beneficiaries/create", { body: input });
    case "airwallex.beneficiary.update": { const { id: beneficiaryId, ...body } = input; return client.request("POST", `/api/v1/beneficiaries/${encodeURIComponent(String(beneficiaryId))}/update`, { body }); }
    case "airwallex.transfer.list": return client.request("GET", "/api/v1/transfers", { query: input });
    case "airwallex.transfer.get": return client.request("GET", `/api/v1/transfers/${encodeURIComponent(String(input.id))}`);
    case "airwallex.transfer.validate": return client.request("POST", "/api/v1/transfers/validate", { body: input, retryable: true });
    case "airwallex.transfer.create": return client.request("POST", "/api/v1/transfers/create", { body: input });
    case "airwallex.transfer.cancel": return client.request("POST", `/api/v1/transfers/${encodeURIComponent(String(input.id))}/cancel`);
    case "airwallex.webhook.list": return client.request("GET", "/api/v1/webhooks", { query: input });
  }
}

export function registerTools(server: McpServer, client: AirwallexClient, config: AirwallexConfig): void {
  for (const spec of TOOL_SPECS) {
    const schema = schemas[spec.name];
    server.tool(spec.name, spec.description, schema.shape, async (args: Record<string, unknown>) => {
      enforceRisk(config, spec.risk);
      try {
        const result = await execute(client, spec.name, args);
        return { content: [{ type: "text", text: JSON.stringify({ risk: spec.risk, data: result }, null, 2) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: message, risk: spec.risk }) }] };
      }
    });
  }
}
