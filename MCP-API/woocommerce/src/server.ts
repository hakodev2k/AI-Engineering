import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { WooCommerceApiError, WooCommerceClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new WooCommerceClient(config);
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const pagination = (a: Record<string, unknown>) => ({ page: a.page as number | undefined, per_page: a.perPage as number | undefined });

async function dispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "woocommerce.product.list": return client.request("GET", "/products", undefined, { ...pagination(a), search:a.search as string|undefined, status:a.status as string|undefined });
    case "woocommerce.product.get": return client.request("GET", `/products/${a.productId}`);
    case "woocommerce.product.create": return client.request("POST", "/products", { name:a.name, type:a.type, status:a.status, regular_price:a.regularPrice, description:a.description, short_description:a.shortDescription });
    case "woocommerce.product.update": return client.request("PUT", `/products/${a.productId}`, { name:a.name, status:a.status, regular_price:a.regularPrice, description:a.description, short_description:a.shortDescription });
    case "woocommerce.order.list": return client.request("GET", "/orders", undefined, { ...pagination(a), status:a.status as string|undefined, customer:a.customerId as number|undefined });
    case "woocommerce.order.get": return client.request("GET", `/orders/${a.orderId}`);
    case "woocommerce.order.status.update": return client.request("PUT", `/orders/${a.orderId}`, { status:a.status });
    case "woocommerce.order.note.add": return client.request("POST", `/orders/${a.orderId}/notes`, { note:a.note, customer_note:a.customerNote });
    case "woocommerce.customer.list": return client.request("GET", "/customers", undefined, { ...pagination(a), search:a.search as string|undefined });
    case "woocommerce.customer.get": return client.request("GET", `/customers/${a.customerId}`);
    case "woocommerce.coupon.list": return client.request("GET", "/coupons", undefined, { ...pagination(a), search:a.search as string|undefined });
    case "woocommerce.webhook.list": return client.request("GET", "/webhooks", undefined, { ...pagination(a), status:a.status as string|undefined });
    default: throw new Error("Unknown WooCommerce tool.");
  }
}

export const server = new Server({ name:"woocommerce-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name:t.name, description:`${t.description} Risk=${t.risk}.`, inputSchema:t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof WooCommerceApiError) {
      if (error.status === 401) throw new Error("WooCommerce authentication failed. Verify consumer key and secret.");
      if (error.status === 403) throw new Error("WooCommerce denied the operation. Verify REST API key permissions and WordPress user capabilities.");
      if (error.status === 404) throw new Error("WooCommerce resource was not found.");
      if (error.status === 429) throw new Error(`WooCommerce rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
      if (error.status >= 400 && error.status < 500) throw new Error(`WooCommerce validation/request failed: ${error.message}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
