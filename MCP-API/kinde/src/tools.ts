import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { KindeConfig } from "./config.js";
import { requireApproval, type Risk } from "./policy.js";
import { KindeClient, sanitizeProviderData } from "./client.js";

export interface ToolSpec { name: string; description: string; risk: Risk; }
export const TOOL_SPECS: ToolSpec[] = [
  { name: "kinde.user.list", description: "List Kinde users with bounded pagination and optional activity/email filters.", risk: "READ" },
  { name: "kinde.user.search", description: "Search Kinde users by name or email using the official advanced-search endpoint.", risk: "READ" },
  { name: "kinde.user.get_by_email", description: "Find users by exact email using the official users endpoint.", risk: "READ" },
  { name: "kinde.user.create", description: "Create an email-identity Kinde user. Requires explicit write approval.", risk: "WRITE" },
  { name: "kinde.user.password_reset.request", description: "Require a user to reset their password at next sign-in. High-risk approval required.", risk: "HIGH_RISK" },
  { name: "kinde.organization.list", description: "List Kinde organizations with bounded pagination.", risk: "READ" },
  { name: "kinde.organization.get", description: "Get one Kinde organization by org_code.", risk: "READ" },
  { name: "kinde.organization.suspension.set", description: "Suspend or unsuspend an organization. High-risk because suspension revokes active access.", risk: "HIGH_RISK" }
];

const approval = z.enum(["approved", "approved-high-risk"]).optional();
const pagination = { page_size: z.number().int().min(1).max(500).optional(), next_token: z.string().min(1).max(4096).optional() };
const userId = z.string().min(1).max(255);
const orgCode = z.string().min(1).max(255).regex(/^[A-Za-z0-9_-]+$/);
const email = z.string().email().max(320);

const schemas = {
  "kinde.user.list": z.object({
    ...pagination,
    email: email.optional(),
    active_since: z.string().datetime({ offset: true }).optional()
  }).strict(),
  "kinde.user.search": z.object({
    query: z.string().min(1).max(320),
    expand: z.enum(["identities", "properties", "identities,properties", "properties,identities"]).optional()
  }).strict(),
  "kinde.user.get_by_email": z.object({ email }).strict(),
  "kinde.user.create": z.object({
    email,
    given_name: z.string().min(1).max(255).optional(),
    family_name: z.string().min(1).max(255).optional(),
    approval
  }).strict(),
  "kinde.user.password_reset.request": z.object({ user_id: userId, approval }).strict(),
  "kinde.organization.list": z.object({ ...pagination }).strict(),
  "kinde.organization.get": z.object({ org_code: orgCode }).strict(),
  "kinde.organization.suspension.set": z.object({ org_code: orgCode, is_suspended: z.boolean(), approval }).strict()
} as const;

function encoded(value: string): string { return encodeURIComponent(value); }

export async function executeTool(spec: ToolSpec, raw: Record<string, unknown>, client: KindeClient, config: KindeConfig): Promise<unknown> {
  const schema = schemas[spec.name as keyof typeof schemas];
  const input = schema.parse(raw) as Record<string, unknown>;
  requireApproval(spec.risk, input.approval as string | undefined, config);
  delete input.approval;
  let result: unknown;
  switch (spec.name) {
    case "kinde.user.list": result = await client.request("/users", { query: input as Record<string, string | number | boolean | undefined> }); break;
    case "kinde.user.search": result = await client.request("/search/users", { query: input as Record<string, string | number | boolean | undefined> }); break;
    case "kinde.user.get_by_email": result = await client.request("/users", { query: { email: input.email as string } }); break;
    case "kinde.user.create": {
      const userEmail = input.email as string;
      const profile: Record<string, string> = { email: userEmail };
      if (input.given_name) profile.given_name = input.given_name as string;
      if (input.family_name) profile.family_name = input.family_name as string;
      result = await client.request("/user", { method: "POST", body: { profile, identities: [{ type: "email", details: { email: userEmail } }] } });
      break;
    }
    case "kinde.user.password_reset.request": result = await client.request(`/users/${encoded(input.user_id as string)}`, { method: "PATCH", body: { is_password_reset_requested: true } }); break;
    case "kinde.organization.list": result = await client.request("/organizations", { query: input as Record<string, string | number | boolean | undefined> }); break;
    case "kinde.organization.get": result = await client.request(`/organization/${encoded(input.org_code as string)}`); break;
    case "kinde.organization.suspension.set": result = await client.request(`/organization/${encoded(input.org_code as string)}`, { method: "PATCH", body: { is_suspended: input.is_suspended } }); break;
    default: throw new Error(`Unsupported tool: ${spec.name}`);
  }
  return sanitizeProviderData(result);
}

export function registerTools(server: McpServer, client: KindeClient, config: KindeConfig): void {
  for (const spec of TOOL_SPECS) {
    const schema = schemas[spec.name as keyof typeof schemas];
    server.tool(spec.name, spec.description, schema.shape, async (input) => {
      const result = await executeTool(spec, input as Record<string, unknown>, client, config);
      return { content: [{ type: "text", text: JSON.stringify({ provider: "kinde", tool: spec.name, risk: spec.risk, untrusted_provider_content: true, result }, null, 2) }] };
    });
  }
}
