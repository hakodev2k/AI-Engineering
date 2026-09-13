import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LemonSqueezyConfig } from "./config.js";
import type { LemonSqueezyClient } from "./client.js";
import { assertApproved } from "./policy.js";
import { CustomerCreate, CustomerList, CustomerUpdate, Id, OrderList, Page, ProductList, StoreList, SubscriptionList, SubscriptionUpdate, VariantList } from "./schemas.js";

const text = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify({ untrustedProviderData: true, data }, null, 2) }] });
const pageQuery = (p: { page: number; pageSize: number }) => ({ "page[number]": p.page, "page[size]": p.pageSize });

export function registerTools(server: McpServer, client: LemonSqueezyClient, config: LemonSqueezyConfig): void {
  server.tool("lemon_squeezy.store.list", "List stores. READ; no approval.", StoreList.shape, async (a) => { const p = StoreList.parse(a); return text(await client.get("/stores", pageQuery(p))); });
  server.tool("lemon_squeezy.store.get", "Get a store by ID. READ; no approval.", Id.shape, async (a) => { const p = Id.parse(a); return text(await client.get(`/stores/${p.id}`)); });
  server.tool("lemon_squeezy.product.list", "List products, optionally by store. READ; no approval.", ProductList.shape, async (a) => { const p = ProductList.parse(a); return text(await client.get("/products", { ...pageQuery(p), "filter[store_id]": p.storeId })); });
  server.tool("lemon_squeezy.product.get", "Get a product by ID. READ; no approval.", Id.shape, async (a) => { const p = Id.parse(a); return text(await client.get(`/products/${p.id}`)); });
  server.tool("lemon_squeezy.variant.list", "List variants, optionally by product/status. READ; no approval.", VariantList.shape, async (a) => { const p = VariantList.parse(a); return text(await client.get("/variants", { ...pageQuery(p), "filter[product_id]": p.productId, "filter[status]": p.status })); });
  server.tool("lemon_squeezy.variant.get", "Get a variant by ID. READ; no approval.", Id.shape, async (a) => { const p = Id.parse(a); return text(await client.get(`/variants/${p.id}`)); });
  server.tool("lemon_squeezy.customer.list", "List customers by store/email. READ; no approval.", CustomerList.shape, async (a) => { const p = CustomerList.parse(a); return text(await client.get("/customers", { ...pageQuery(p), "filter[store_id]": p.storeId, "filter[email]": p.email })); });
  server.tool("lemon_squeezy.customer.get", "Get a customer by ID. READ; no approval.", Id.shape, async (a) => { const p = Id.parse(a); return text(await client.get(`/customers/${p.id}`)); });
  server.tool("lemon_squeezy.customer.create", "Create a customer. WRITE; server opt-in and approved=true required.", CustomerCreate.shape, async (a) => {
    const p = CustomerCreate.parse(a); assertApproved(config, "WRITE", p.approved);
    const { approved: _approved, storeId, ...attributes } = p;
    return text(await client.post("/customers", { data: { type: "customers", attributes, relationships: { store: { data: { type: "stores", id: storeId } } } } }));
  });
  server.tool("lemon_squeezy.customer.update", "Update customer profile or archive marketing status. WRITE; server opt-in and approved=true required.", CustomerUpdate.shape, async (a) => {
    const p = CustomerUpdate.parse(a); assertApproved(config, "WRITE", p.approved);
    const { approved: _approved, id, ...attributes } = p;
    return text(await client.patch(`/customers/${id}`, { data: { type: "customers", id, attributes } }));
  });
  server.tool("lemon_squeezy.order.list", "List orders by store/customer email. READ; no approval.", OrderList.shape, async (a) => { const p = OrderList.parse(a); return text(await client.get("/orders", { ...pageQuery(p), "filter[store_id]": p.storeId, "filter[user_email]": p.userEmail })); });
  server.tool("lemon_squeezy.order.get", "Get an order by ID. READ; no approval.", Id.shape, async (a) => { const p = Id.parse(a); return text(await client.get(`/orders/${p.id}`)); });
  server.tool("lemon_squeezy.subscription.list", "List subscriptions by store/email/status. READ; no approval.", SubscriptionList.shape, async (a) => { const p = SubscriptionList.parse(a); return text(await client.get("/subscriptions", { ...pageQuery(p), "filter[store_id]": p.storeId, "filter[user_email]": p.userEmail, "filter[status]": p.status })); });
  server.tool("lemon_squeezy.subscription.get", "Get a subscription by ID including portal URLs/status. READ; no approval.", Id.shape, async (a) => { const p = Id.parse(a); return text(await client.get(`/subscriptions/${p.id}`)); });
  server.tool("lemon_squeezy.subscription.update", "Change plan, pause/resume, billing anchor, trial, proration behavior, or cancellation state. HIGH_RISK; explicit server opt-in and approved=true required.", SubscriptionUpdate.shape, async (a) => {
    const p = SubscriptionUpdate.parse(a); assertApproved(config, "HIGH_RISK", p.approved);
    const attributes = {
      variant_id: p.variantId, cancelled: p.cancelled, trial_ends_at: p.trialEndsAt,
      billing_anchor: p.billingAnchor, pause: p.pause ? { mode: p.pause.mode, resumes_at: p.pause.resumesAt } : p.pause,
      invoice_immediately: p.invoiceImmediately, disable_prorations: p.disableProrations
    };
    return text(await client.patch(`/subscriptions/${p.id}`, { data: { type: "subscriptions", id: p.id, attributes: Object.fromEntries(Object.entries(attributes).filter(([,v]) => v !== undefined)) } }));
  });
}
