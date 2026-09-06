import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { RecurlyApiError, RecurlyClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new RecurlyClient(config);
const enc = (v: unknown) => encodeURIComponent(String(v));
const q = (v: unknown) => v === undefined ? undefined : String(v);
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

async function dispatch(name: string, a: Record<string, unknown>) {
  const page = { limit:q(a.limit), cursor:q(a.cursor) };
  switch (name) {
    case "recurly.account.list": return client.request("GET", "/accounts", undefined, page);
    case "recurly.account.get": return client.request("GET", `/accounts/${enc(a.accountId)}`);
    case "recurly.account.create": return client.request("POST", "/accounts", { code:a.code, email:a.email, first_name:a.firstName, last_name:a.lastName, company:a.company });
    case "recurly.account.update": return client.request("PUT", `/accounts/${enc(a.accountId)}`, { email:a.email, first_name:a.firstName, last_name:a.lastName, company:a.company });
    case "recurly.subscription.list": return client.request("GET", "/subscriptions", undefined, page);
    case "recurly.subscription.get": return client.request("GET", `/subscriptions/${enc(a.subscriptionId)}`);
    case "recurly.subscription.cancel": return client.request("POST", `/subscriptions/${enc(a.subscriptionId)}/cancel`, { timeframe:a.timeframe });
    case "recurly.subscription.pause": return client.request("POST", `/subscriptions/${enc(a.subscriptionId)}/pause`, { remaining_pause_cycles:a.remainingPauseCycles });
    case "recurly.invoice.list": return client.request("GET", "/invoices", undefined, page);
    case "recurly.invoice.get": return client.request("GET", `/invoices/${enc(a.invoiceId)}`);
    case "recurly.plan.list": return client.request("GET", "/plans", undefined, page);
    case "recurly.transaction.list": return client.request("GET", "/transactions", undefined, page);
    default: throw new Error("Unknown Recurly tool.");
  }
}

export const server = new Server({ name:"recurly-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name:t.name, description:`${t.description} Risk=${t.risk}.`, inputSchema:t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof RecurlyApiError) {
      if (error.status === 401) throw new Error("Recurly authentication failed. Verify the site API key.");
      if (error.status === 403) throw new Error("Recurly denied the operation. Verify API key permissions and site access.");
      if (error.status === 404) throw new Error("Recurly resource was not found.");
      if (error.status === 406) throw new Error("Configured Recurly API version is unsupported. Pin a supported date-based version.");
      if (error.status === 422) throw new Error(`Recurly validation failed: ${error.message}`);
      if (error.status === 429) throw new Error(`Recurly rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
