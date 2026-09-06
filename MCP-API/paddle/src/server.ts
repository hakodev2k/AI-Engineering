import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { PaddleApiError, PaddleClient } from "./client.js";
import { assertAllowed, PolicyError } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";

const config = loadConfig();
const client = new PaddleClient(config);
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const q = (value: unknown) => value === undefined ? undefined : String(value);
const listQuery = (a: Record<string, unknown>, extra: Record<string, string | number | boolean | undefined> = {}) => ({ per_page: Number(a.perPage), after:q(a.after), ...extra });
const mutable = (a: Record<string, unknown>, keys: string[]) => Object.fromEntries(keys.filter(k => a[k] !== undefined).map(k => [k, a[k]]));

async function dispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "paddle.product.list": return client.list("/products", listQuery(a,{status:q(a.status)}), Number(a.maxPages));
    case "paddle.product.get": return client.request("GET", `/products/${encodeURIComponent(String(a.productId))}`);
    case "paddle.price.list": return client.list("/prices", listQuery(a,{product_id:q(a.productId),status:q(a.status)}), Number(a.maxPages));
    case "paddle.price.get": return client.request("GET", `/prices/${encodeURIComponent(String(a.priceId))}`);
    case "paddle.customer.list": return client.list("/customers", listQuery(a,{status:q(a.status)}), Number(a.maxPages));
    case "paddle.customer.get": return client.request("GET", `/customers/${encodeURIComponent(String(a.customerId))}`);
    case "paddle.transaction.list": return client.list("/transactions", listQuery(a,{status:q(a.status),customer_id:q(a.customerId)}), Number(a.maxPages));
    case "paddle.transaction.get": return client.request("GET", `/transactions/${encodeURIComponent(String(a.transactionId))}`);
    case "paddle.subscription.list": return client.list("/subscriptions", listQuery(a,{status:q(a.status),customer_id:q(a.customerId)}), Number(a.maxPages));
    case "paddle.subscription.get": return client.request("GET", `/subscriptions/${encodeURIComponent(String(a.subscriptionId))}`);
    case "paddle.adjustment.list": return client.list("/adjustments", listQuery(a,{transaction_id:q(a.transactionId)}), Number(a.maxPages));
    case "paddle.event_type.list": return client.request("GET", "/event-types");
    case "paddle.product.create": return client.request("POST", "/products", {body:{name:a.name,description:a.description,tax_category:a.taxCategory,custom_data:a.customData}});
    case "paddle.product.update": {
      const source = mutable(a,["name","description","customData"]);
      const body: Record<string,unknown> = {...source};
      if ("customData" in body) { body.custom_data=body.customData; delete body.customData; }
      if (a.taxCategory !== undefined) body.tax_category=a.taxCategory;
      return client.request("PATCH", `/products/${encodeURIComponent(String(a.productId))}`, {body});
    }
    case "paddle.price.create": {
      const unitPrice = a.unitPrice as {amount:string;currencyCode:string};
      return client.request("POST", "/prices", {body:{product_id:a.productId,description:a.description,unit_price:{amount:unitPrice.amount,currency_code:unitPrice.currencyCode},billing_cycle:a.billingCycle,trial_period:a.trialPeriod,tax_mode:a.taxMode,custom_data:a.customData}});
    }
    case "paddle.customer.create": return client.request("POST", "/customers", {body:{email:a.email,name:a.name,locale:a.locale,custom_data:a.customData}});
    case "paddle.customer.update": {
      const body: Record<string,unknown> = {};
      if (a.email !== undefined) body.email=a.email;
      if (a.name !== undefined) body.name=a.name;
      if (a.locale !== undefined) body.locale=a.locale;
      if (a.customData !== undefined) body.custom_data=a.customData;
      return client.request("PATCH", `/customers/${encodeURIComponent(String(a.customerId))}`, {body});
    }
    case "paddle.subscription.pause": return client.request("POST", `/subscriptions/${encodeURIComponent(String(a.subscriptionId))}/pause`, {body:{effective_from:a.effectiveFrom,resume_at:a.resumeAt}});
    case "paddle.adjustment.create": return client.request("POST", "/adjustments", {body:{action:a.action,transaction_id:a.transactionId,reason:a.reason,items:(a.items as {itemId:string;type:string;amount?:string}[]).map(i=>({item_id:i.itemId,type:i.type,amount:i.amount}))}});
    case "paddle.subscription.cancel": return client.request("POST", `/subscriptions/${encodeURIComponent(String(a.subscriptionId))}/cancel`, {body:{effective_from:a.effectiveFrom}});
    default: throw new Error("Tool is not exposed by this connector.");
  }
}

export const server = new Server({ name:"paddle-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({
  name:t.name,
  description:`${t.purpose} Permission=${t.permission}; Risk=${t.risk}; Approval=${t.approval}; Output=${t.output}; Errors=${t.errors}`,
  inputSchema:t.inputSchema as any
})) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const parsed = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, parsed, config);
  try { return result(await dispatch(tool.name, parsed)); }
  catch (error) {
    if (error instanceof PolicyError) throw error;
    if (error instanceof PaddleApiError) {
      const suffix = [error.code && `code=${error.code}`, error.requestId && `request_id=${error.requestId}`, error.retryAfter !== undefined && `retry_after=${error.retryAfter}s`].filter(Boolean).join("; ");
      if (error.status === 401) throw new Error(`Paddle authentication failed. Rotate or replace the API key.${suffix ? ` ${suffix}` : ""}`);
      if (error.status === 403) throw new Error(`Paddle denied the operation. Verify API-key permissions.${suffix ? ` ${suffix}` : ""}`);
      if (error.status === 404) throw new Error(`Paddle resource not found.${suffix ? ` ${suffix}` : ""}`);
      if (error.status === 429) throw new Error(`Paddle rate limit reached.${suffix ? ` ${suffix}` : ""}`);
      throw new Error(`Paddle API error (${error.status}): ${error.message}${suffix ? `; ${suffix}` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
