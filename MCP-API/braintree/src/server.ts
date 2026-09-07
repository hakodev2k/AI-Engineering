import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { BraintreeClient, BraintreeConnectorError } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const compact = (value: Record<string, unknown>) => Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
const result = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify({ source: "untrusted_provider_data", value }, null, 2) }]
});

export async function dispatch(client: BraintreeClient, name: string, a: Record<string, unknown>) {
  const g = client.gateway;
  switch (name) {
    case "braintree.customer.get": return client.call(() => g.customer.find(String(a.customerId)));
    case "braintree.customer.create": return client.call(() => g.customer.create(compact({ id:a.customerId, firstName:a.firstName, lastName:a.lastName, company:a.company, email:a.email, phone:a.phone })), { retryable:false });
    case "braintree.customer.update": return client.call(() => g.customer.update(String(a.customerId), compact({ firstName:a.firstName, lastName:a.lastName, company:a.company, email:a.email, phone:a.phone })), { retryable:false });
    case "braintree.client_token.create": return client.call(() => g.clientToken.generate(a.customerId ? { customerId:String(a.customerId) } : {}), { retryable:false });
    case "braintree.transaction.get": return client.call(() => g.transaction.find(String(a.transactionId)));
    case "braintree.transaction.sale": return client.call(() => g.transaction.sale(compact({ amount:String(a.amount), paymentMethodNonce:String(a.paymentMethodNonce), orderId:a.orderId, customerId:a.customerId, options:{ submitForSettlement:Boolean(a.submitForSettlement) } })), { retryable:false });
    case "braintree.transaction.refund": return client.call(() => a.amount ? g.transaction.refund(String(a.transactionId), String(a.amount)) : g.transaction.refund(String(a.transactionId)), { retryable:false });
    case "braintree.transaction.void": return client.call(() => g.transaction.void(String(a.transactionId)), { retryable:false });
    case "braintree.subscription.get": return client.call(() => g.subscription.find(String(a.subscriptionId)));
    case "braintree.subscription.cancel": return client.call(() => g.subscription.cancel(String(a.subscriptionId)), { retryable:false });
    case "braintree.plan.list": return client.call(() => g.plan.all());
    case "braintree.plan.get": return client.call(() => g.plan.find(String(a.planId)));
    case "braintree.merchant_account.get": return client.call(() => g.merchantAccount.find(String(a.merchantAccountId)));
    default: throw new Error("Tool is not exposed by this connector.");
  }
}

export function createServer(client?: BraintreeClient) {
  const config = loadConfig();
  const activeClient = client ?? new BraintreeClient(config);
  const server = new Server({ name:"braintree-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map(tool => ({
      name: tool.name,
      description: `${tool.description} Permission=${tool.permission}; Risk=${tool.risk}; Approval=${tool.approval}.`,
      inputSchema: tool.inputSchema as any
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const tool = TOOL_MAP.get(request.params.name);
    if (!tool) throw new Error("Tool is not exposed by this connector.");
    const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
    assertAllowed(tool.risk, tool.name, args, config);
    try { return result(await dispatch(activeClient, tool.name, args)); }
    catch (error) {
      if (error instanceof BraintreeConnectorError) throw new Error(`[${error.code}] ${error.message}`);
      throw error;
    }
  });
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createServer().connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : "Braintree connector failed.");
    process.exit(1);
  });
}
