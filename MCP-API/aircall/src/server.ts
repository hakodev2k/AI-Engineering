import net from "node:net";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ZodError } from "zod";
import { loadConfig } from "./config.js";
import { AircallClient, AircallError } from "./client.js";
import { assertAllowed } from "./policy.js";
import { toolMap, tools } from "./tools.js";

function assertSafeWebhookUrl(raw: string): void {
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new Error("Webhook URL must use HTTPS.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || net.isIP(host) !== 0) {
    throw new Error("Webhook URL must use a public DNS hostname; localhost and IP literals are rejected to reduce SSRF risk.");
  }
  if (url.username || url.password) throw new Error("Webhook URLs must not contain embedded credentials.");
}

function stripApproval(args: Record<string, unknown>) {
  const copy = { ...args };
  delete copy.approval;
  return copy;
}

function textResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ provider: "aircall", untrusted_provider_data: true, data }) }]
  };
}

async function execute(client: AircallClient, name: string, args: Record<string, unknown>) {
  switch (name) {
    case "aircall.call.list":
      return client.request("GET", "/calls", { query: args as Record<string, string | number | boolean | undefined> });
    case "aircall.call.get":
      return client.request("GET", `/calls/${args.call_id}`);
    case "aircall.user.list":
      return client.request("GET", "/users", { query: args as Record<string, string | number | boolean | undefined> });
    case "aircall.user.get":
      return client.request("GET", `/users/${args.user_id}`);
    case "aircall.user.availability.list":
      return client.request("GET", "/users/availabilities");
    case "aircall.team.list":
      return client.request("GET", "/teams", { query: args as Record<string, string | number | boolean | undefined> });
    case "aircall.number.list":
      return client.request("GET", "/numbers", { query: args as Record<string, string | number | boolean | undefined> });
    case "aircall.tag.list":
      return client.request("GET", "/tags", { query: args as Record<string, string | number | boolean | undefined> });
    case "aircall.webhook.list":
      return client.request("GET", "/webhooks", { query: args as Record<string, string | number | boolean | undefined> });
    case "aircall.dial.prepare":
      return client.request("POST", `/users/${args.user_id}/dial`, { body: { phone_number: args.phone_number }, retrySafe: false });
    case "aircall.webhook.create":
      assertSafeWebhookUrl(String(args.url));
      return client.request("POST", "/webhooks", { body: { custom_name: args.custom_name, url: args.url, events: args.events }, retrySafe: false });
    case "aircall.webhook.delete":
      return client.request("DELETE", `/webhooks/${args.webhook_id}`, { retrySafe: false });
    default:
      throw new Error("Unknown Aircall tool.");
  }
}

export function buildServer(client?: AircallClient) {
  const config = loadConfig();
  const api = client ?? new AircallClient(config);
  const server = new Server({ name: "aircall-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      description: `${t.description} Risk=${t.risk}.${t.approval ? " Explicit human approval is required." : ""}`,
      inputSchema: t.inputSchema
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const def = toolMap.get(request.params.name);
    if (!def) throw new Error("Unknown or unapproved Aircall tool.");
    try {
      const parsed = def.parse(request.params.arguments ?? {});
      const approval = parsed.approval as { confirmed?: boolean; reason?: string } | undefined;
      assertAllowed(def.risk, approval, config);
      const result = await execute(api, def.name, stripApproval(parsed));
      return textResult(result);
    } catch (error) {
      if (error instanceof ZodError) throw new Error(`Invalid tool input: ${error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
      if (error instanceof AircallError) {
        if (error.status === 401) throw new Error("Aircall authentication failed. Verify the configured Basic Auth credentials or OAuth access token.");
        if (error.status === 403) throw new Error("Aircall denied the operation. Verify account access, phone-number grants, plan requirements, and integration permissions.");
        if (error.status === 429) throw new Error(`Aircall rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}s.` : " Back off before retrying."}`);
      }
      throw error;
    }
  });

  return server;
}

async function main() {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
