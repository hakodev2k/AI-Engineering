import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { authorize, loadConfig, PolarClient, type Risk } from './core.js';

const cfg = loadConfig();
const client = new PolarClient(cfg);
const uuid = z.string().uuid();
const page = { page: z.number().int().min(1).optional(), limit: z.number().int().min(1).max(100).optional() };
const metadata = z.record(z.union([z.string().max(500), z.number(), z.boolean()])).refine(v => Object.keys(v).length <= 50, 'metadata max 50 keys').optional();
const defs = new Map<string, { description: string; risk: Risk; schema: z.ZodTypeAny; run: (a: any) => Promise<unknown> }>();
const add = (name: string, description: string, risk: Risk, schema: z.ZodTypeAny, run: (a: any) => Promise<unknown>) => defs.set(name, { description, risk, schema, run });
const approval = <T extends z.ZodRawShape>(shape: T) => z.object({ ...shape, approved: z.boolean().optional() }).strict();

add('polar.product.list', 'List products with bounded pagination and optional search filters.', 'READ', z.object({ ...page, query: z.string().max(256).optional(), is_archived: z.boolean().optional(), is_recurring: z.boolean().optional() }).strict(), a => client.request('GET', '/products', undefined, a));
add('polar.product.get', 'Get a product by ID.', 'READ', z.object({ id: uuid }).strict(), a => client.request('GET', `/products/${a.id}`));
add('polar.customer.list', 'List customers, optionally by exact email or search query.', 'READ', z.object({ ...page, email: z.string().email().optional(), query: z.string().max(256).optional() }).strict(), a => client.request('GET', '/customers', undefined, a));
add('polar.customer.get', 'Get a customer by ID.', 'READ', z.object({ id: uuid }).strict(), a => client.request('GET', `/customers/${a.id}`));
add('polar.customer.state', 'Get customer state including active subscriptions, granted benefits, and meters.', 'READ', z.object({ id: uuid.optional(), external_id: z.string().min(1).max(255).optional() }).strict().refine(a => Boolean(a.id) !== Boolean(a.external_id), 'provide exactly one of id or external_id'), a => client.request('GET', a.id ? `/customers/${a.id}/state` : `/customers/external/${encodeURIComponent(a.external_id)}/state`));
add('polar.subscription.list', 'List subscriptions.', 'READ', z.object({ ...page, customer_id: uuid.optional(), product_id: uuid.optional(), active: z.boolean().optional() }).strict(), a => client.request('GET', '/subscriptions', undefined, a));
add('polar.subscription.get', 'Get a subscription by ID.', 'READ', z.object({ id: uuid }).strict(), a => client.request('GET', `/subscriptions/${a.id}`));
add('polar.order.list', 'List orders.', 'READ', z.object({ ...page, customer_id: uuid.optional(), product_id: uuid.optional() }).strict(), a => client.request('GET', '/orders', undefined, a));
add('polar.order.get', 'Get an order by ID.', 'READ', z.object({ id: uuid }).strict(), a => client.request('GET', `/orders/${a.id}`));
add('polar.metrics.get', 'Get order and subscription metrics for a date range.', 'READ', z.object({ start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), interval: z.enum(['hour','day','week','month','year']).optional() }).strict(), a => client.request('GET', '/metrics', undefined, a));
add('polar.checkout.get', 'Get a checkout session by ID.', 'READ', z.object({ id: uuid }).strict(), a => client.request('GET', `/checkouts/${a.id}`));
add('polar.checkout.create', 'Create a customer-facing checkout session. Approval is required by default.', 'WRITE', approval({ products: z.array(uuid).min(1).max(20), customer_id: uuid.optional(), external_customer_id: z.string().max(255).optional(), customer_email: z.string().email().optional(), customer_name: z.string().max(256).optional(), success_url: z.string().url().max(2083).optional(), return_url: z.string().url().max(2083).optional(), allow_discount_codes: z.boolean().optional(), require_billing_address: z.boolean().optional(), metadata }), a => { const { approved, ...body } = a; return client.request('POST', '/checkouts', body); });
add('polar.refund.create', 'Issue a full or partial refund. This financially impactful action always requires approval.', 'HIGH_RISK', approval({ order_id: uuid, amount: z.number().int().min(1), reason: z.enum(['duplicate','fraudulent','customer_request','service_disruption','satisfaction_guarantee','dispute_prevention','other']), revoke_benefits: z.boolean().optional(), comment: z.string().max(1000).optional(), metadata }), a => { const { approved, ...body } = a; return client.request('POST', '/refunds', body); });

export function createServer() {
  const server = new Server({ name: 'polar-mcp-api-connector', version: '1.0.0' }, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [...defs.entries()].map(([name, d]) => ({ name, description: `${d.description} Risk=${d.risk}. ${d.risk === 'READ' ? 'No approval required.' : 'Set approved=true only after explicit human approval.'}`, inputSchema: zodToJsonSchema(d.schema, { target: 'openApi3' }) as any })) }));
  server.setRequestHandler(CallToolRequestSchema, async req => {
    const d = defs.get(req.params.name);
    if (!d) return { isError: true, content: [{ type: 'text', text: 'UNKNOWN_TOOL' }] };
    try {
      const args = d.schema.parse(req.params.arguments ?? {});
      authorize(d.risk, args.approved, cfg);
      const result = await d.run(args);
      return { content: [{ type: 'text', text: JSON.stringify({ provider: 'polar', untrusted_data: true, result }, null, 2) }] };
    } catch (e) {
      return { isError: true, content: [{ type: 'text', text: e instanceof Error ? e.message : 'UNKNOWN_ERROR' }] };
    }
  });
  return server;
}

if (process.env.NODE_ENV !== 'test') await createServer().connect(new StdioServerTransport());
