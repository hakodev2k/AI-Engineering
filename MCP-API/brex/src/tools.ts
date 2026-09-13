import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BrexClient } from "./client.js";
import { enforcePolicy, type ToolPolicy } from "./policy.js";

export interface ToolSpec { name: string; description: string; policy: ToolPolicy; }

export const TOOL_SPECS: ToolSpec[] = [
  { name: "brex.user.list", description: "List Brex users, optionally filtered by email.", policy: { risk: "READ", approvalRequired: false, permission: "users.readonly" } },
  { name: "brex.user.get", description: "Get a Brex user by ID.", policy: { risk: "READ", approvalRequired: false, permission: "users.readonly" } },
  { name: "brex.card.list", description: "List Brex cards, optionally filtered by user ID.", policy: { risk: "READ", approvalRequired: false, permission: "cards.readonly" } },
  { name: "brex.card.get", description: "Get a Brex card by ID. Card PAN is never requested.", policy: { risk: "READ", approvalRequired: false, permission: "cards.readonly" } },
  { name: "brex.department.list", description: "List departments.", policy: { risk: "READ", approvalRequired: false, permission: "departments.readonly" } },
  { name: "brex.location.list", description: "List company locations.", policy: { risk: "READ", approvalRequired: false, permission: "locations.readonly" } },
  { name: "brex.legal_entity.list", description: "List legal entities.", policy: { risk: "READ", approvalRequired: false, permission: "legal_entities.readonly" } },
  { name: "brex.legal_entity.get", description: "Get a legal entity by ID.", policy: { risk: "READ", approvalRequired: false, permission: "legal_entities.readonly" } },
  { name: "brex.title.list", description: "List employee titles.", policy: { risk: "READ", approvalRequired: false, permission: "titles.readonly" } },
  { name: "brex.account.card.get_primary", description: "Get the primary card account.", policy: { risk: "READ", approvalRequired: false, permission: "accounts.card.readonly" } },
  { name: "brex.account.cash.list", description: "List Brex Cash accounts.", policy: { risk: "READ", approvalRequired: false, permission: "accounts.cash.readonly" } },
  { name: "brex.transaction.card.list", description: "List primary card transactions with bounded pagination and optional posted-date filters.", policy: { risk: "READ", approvalRequired: false, permission: "transactions.card.readonly" } },
  { name: "brex.transaction.cash.list", description: "List transactions for one Brex Cash account.", policy: { risk: "READ", approvalRequired: false, permission: "transactions.cash.readonly" } },
  { name: "brex.vendor.list", description: "List vendors, optionally filtered by name.", policy: { risk: "READ", approvalRequired: false, permission: "vendors.readonly" } },
  { name: "brex.vendor.get", description: "Get a vendor by ID.", policy: { risk: "READ", approvalRequired: false, permission: "vendors.readonly" } }
];

const id = z.string().min(1).max(256);
const page = { limit: z.number().int().min(1).max(1000).optional(), cursor: z.string().min(1).max(4096).optional() };
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD");

const schemas = {
  "brex.user.list": z.object({ ...page, email: z.string().email().optional() }).strict(),
  "brex.user.get": z.object({ id }).strict(),
  "brex.card.list": z.object({ ...page, userId: id.optional() }).strict(),
  "brex.card.get": z.object({ id }).strict(),
  "brex.department.list": z.object({ ...page, name: z.string().min(1).max(200).optional() }).strict(),
  "brex.location.list": z.object({ ...page, name: z.string().min(1).max(200).optional() }).strict(),
  "brex.legal_entity.list": z.object(page).strict(),
  "brex.legal_entity.get": z.object({ id }).strict(),
  "brex.title.list": z.object({ ...page, name: z.string().min(1).max(200).optional() }).strict(),
  "brex.account.card.get_primary": z.object({}).strict(),
  "brex.account.cash.list": z.object(page).strict(),
  "brex.transaction.card.list": z.object({ ...page, postedAtStart: date.optional(), postedAtEnd: date.optional() }).strict(),
  "brex.transaction.cash.list": z.object({ accountId: id, ...page, postedAtStart: date.optional(), postedAtEnd: date.optional() }).strict(),
  "brex.vendor.list": z.object({ ...page, name: z.string().min(1).max(200).optional() }).strict(),
  "brex.vendor.get": z.object({ id }).strict()
} as const;

function asText(tool: ToolSpec, result: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ provider: "brex", tool: tool.name, risk: tool.policy.risk, required_permission: tool.policy.permission, untrusted_provider_content: true, result }, null, 2) }] };
}

export async function executeTool(spec: ToolSpec, raw: Record<string, unknown>, client: BrexClient): Promise<unknown> {
  const input = schemas[spec.name as keyof typeof schemas].parse(raw) as any;
  enforcePolicy(spec.policy, input.approval);
  switch (spec.name) {
    case "brex.user.list": return client.listUsers(input);
    case "brex.user.get": return client.getUser(input.id);
    case "brex.card.list": return client.listCards(input);
    case "brex.card.get": return client.getCard(input.id);
    case "brex.department.list": return client.listDepartments(input);
    case "brex.location.list": return client.listLocations(input);
    case "brex.legal_entity.list": return client.listLegalEntities(input);
    case "brex.legal_entity.get": return client.getLegalEntity(input.id);
    case "brex.title.list": return client.listTitles(input);
    case "brex.account.card.get_primary": return client.getPrimaryCardAccount();
    case "brex.account.cash.list": return client.listCashAccounts(input);
    case "brex.transaction.card.list": return client.listPrimaryCardTransactions(input);
    case "brex.transaction.cash.list": return client.listCashTransactions(input.accountId, input);
    case "brex.vendor.list": return client.listVendors(input);
    case "brex.vendor.get": return client.getVendor(input.id);
    default: throw new Error(`Unsupported Brex tool: ${spec.name}`);
  }
}

export function registerTools(server: McpServer, client: BrexClient): void {
  for (const spec of TOOL_SPECS) {
    const schema = schemas[spec.name as keyof typeof schemas];
    server.tool(spec.name, spec.description, schema.shape, async (input) => asText(spec, await executeTool(spec, input as Record<string, unknown>, client)));
  }
}
