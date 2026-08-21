import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import Stripe from 'stripe';
import { loadConfig } from './config.js';
import { StripeClient, mapStripeError } from './client.js';
import { assertApproval } from './policy.js';

const cfg = loadConfig();
const client = new StripeClient(cfg);
const server = new McpServer({ name: 'stripe-mcp-connector', version: '1.0.0' });
const limit = z.number().int().min(1).max(100).default(20);
const cursor = z.string().min(1).optional();

function ok(data: unknown) { return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] }; }
function register(name: string, description: string, schema: Record<string, z.ZodTypeAny>, handler: (args: any) => Promise<unknown>) {
  server.tool(name, description, schema, async (args) => {
    try { return ok(await handler(args)); } catch (e) { throw mapStripeError(e); }
  });
}

register('stripe.account.get', 'Read the authenticated Stripe account.', {}, async () => client.accountGet());
register('stripe.customer.list', 'List customers with bounded pagination.', { limit, startingAfter: cursor }, async (a) => client.customerList(a.limit, a.startingAfter));
register('stripe.customer.get', 'Get one customer.', { customerId: z.string().regex(/^cus_[A-Za-z0-9]+$/) }, async (a) => client.customerGet(a.customerId));
register('stripe.customer.create', 'Create a customer. Requires approval.', {
  email: z.string().email().optional(), name: z.string().min(1).max(200).optional(), description: z.string().max(500).optional(), approvalId: z.string().optional()
}, async (a) => { assertApproval('stripe.customer.create', a.approvalId, cfg.approvalSecret); return client.customerCreate({ email: a.email, name: a.name, description: a.description }); });
register('stripe.payment_intent.list', 'List payment intents.', { limit, startingAfter: cursor }, async (a) => client.paymentIntentList(a.limit, a.startingAfter));
register('stripe.payment_intent.get', 'Get one payment intent.', { paymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]+$/) }, async (a) => client.paymentIntentGet(a.paymentIntentId));
register('stripe.refund.create', 'Create a refund for a payment intent. High-risk; explicit approval required.', {
  paymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]+$/), amount: z.number().int().positive().optional(), reason: z.enum(['duplicate','fraudulent','requested_by_customer']).optional(), approvalId: z.string()
}, async (a) => { assertApproval('stripe.refund.create', a.approvalId, cfg.approvalSecret); return client.refundCreate({ payment_intent: a.paymentIntentId, amount: a.amount, reason: a.reason }); });
register('stripe.product.list', 'List active products.', { limit, startingAfter: cursor }, async (a) => client.productList(a.limit, a.startingAfter));
register('stripe.price.list', 'List active prices.', { limit, startingAfter: cursor }, async (a) => client.priceList(a.limit, a.startingAfter));
register('stripe.subscription.list', 'List subscriptions.', { limit, startingAfter: cursor }, async (a) => client.subscriptionList(a.limit, a.startingAfter));
register('stripe.subscription.get', 'Get one subscription.', { subscriptionId: z.string().regex(/^sub_[A-Za-z0-9]+$/) }, async (a) => client.subscriptionGet(a.subscriptionId));
register('stripe.webhook.verify', 'Verify a Stripe webhook signature and return the parsed event as untrusted provider data.', {
  payload: z.string().min(1).max(2_000_000), signature: z.string().min(1)
}, async (a) => {
  if (!cfg.webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  const event = Stripe.webhooks.constructEvent(a.payload, a.signature, cfg.webhookSecret);
  return { id: event.id, type: event.type, created: event.created, livemode: event.livemode, data: event.data };
});

await server.connect(new StdioServerTransport());
