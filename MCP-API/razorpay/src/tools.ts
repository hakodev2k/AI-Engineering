import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RazorpayClient } from './client.js';
import { enforce } from './config.js';
import type { Config } from './config.js';

const rid = z.string().regex(/^[A-Za-z0-9_\-]{3,100}$/);
const approval = { approved: z.boolean().optional().describe('Must be true only after explicit human approval.') };
const count = z.number().int().min(1).max(100).optional();
const skip = z.number().int().min(0).max(100000).optional();
const unix = z.number().int().min(0).optional();
const currency = z.string().regex(/^[A-Z]{3}$/).default('INR');
const notes = z.record(z.string().max(256)).optional();
function ok(data: unknown) { return { content: [{ type: 'text' as const, text: JSON.stringify(data) }], structuredContent: (data && typeof data === 'object' ? data : { value: data }) as Record<string, unknown> }; }

export function registerTools(server: McpServer, client: RazorpayClient, cfg: Config): void {
  server.registerTool('razorpay.payment.get', { description: 'Fetch a payment by ID. READ. Official MCP preferred; REST fallback.', inputSchema: { payment_id: rid } }, async ({payment_id}) => ok(await client.readWithFallback('fetch_payment',{payment_id},`/payments/${payment_id}`)));
  server.registerTool('razorpay.payment.list', { description: 'List payments with bounded pagination/time filters. READ.', inputSchema: { count, skip, from: unix, to: unix } }, async (a) => ok(await client.readWithFallback('fetch_all_payments',a,'/payments',a)));
  server.registerTool('razorpay.payment.card.get', { description: 'Fetch card details used for a payment. READ; payment data is untrusted content.', inputSchema: { payment_id: rid } }, async ({payment_id}) => ok(await client.readWithFallback('fetch_payment_card_details',{payment_id},`/payments/${payment_id}/card`)));
  server.registerTool('razorpay.payment.capture', { description: 'Capture an authorized payment. HIGH_RISK money-moving action; explicit approval required. No blind retry.', inputSchema: { payment_id: rid, amount: z.number().int().positive(), currency, ...approval } }, async ({approved,...a}) => { enforce('razorpay.payment.capture',approved,cfg.requireWriteApproval); return ok(await client.mcpCall('capture_payment',a,false)); });

  server.registerTool('razorpay.order.get', { description: 'Fetch an order by ID. READ.', inputSchema: { order_id: rid } }, async ({order_id}) => ok(await client.readWithFallback('fetch_order',{order_id},`/orders/${order_id}`)));
  server.registerTool('razorpay.order.list', { description: 'List orders with bounded pagination/time filters. READ.', inputSchema: { count, skip, from: unix, to: unix, authorized: z.boolean().optional(), receipt: z.string().max(100).optional() } }, async (a) => ok(await client.readWithFallback('fetch_all_orders',a,'/orders',a)));
  server.registerTool('razorpay.order.payments.list', { description: 'List payments attached to an order. READ.', inputSchema: { order_id: rid } }, async ({order_id}) => ok(await client.readWithFallback('fetch_order_payments',{order_id},`/orders/${order_id}/payments`)));
  server.registerTool('razorpay.order.create', { description: 'Create a Razorpay order. WRITE; approval required by default. Amount is currency subunits.', inputSchema: { amount: z.number().int().positive().max(100000000000), currency, receipt: z.string().min(1).max(100).optional(), notes, ...approval } }, async ({approved,...a}) => { enforce('razorpay.order.create',approved,cfg.requireWriteApproval); return ok(await client.mcpCall('create_order',a,false)); });

  server.registerTool('razorpay.payment_link.get', { description: 'Fetch a payment link by ID. READ.', inputSchema: { payment_link_id: rid } }, async ({payment_link_id}) => ok(await client.readWithFallback('fetch_payment_link',{payment_link_id},`/payment_links/${payment_link_id}`)));
  server.registerTool('razorpay.payment_link.list', { description: 'List payment links. READ.', inputSchema: { count, skip } }, async (a) => ok(await client.readWithFallback('fetch_all_payment_links',a,'/payment_links',a)));
  server.registerTool('razorpay.payment_link.create', { description: 'Create a payable external payment link. HIGH_RISK public financial action; explicit approval required.', inputSchema: { amount: z.number().int().positive().max(100000000000), currency, description: z.string().min(1).max(2048), reference_id: z.string().max(100).optional(), customer: z.object({ name: z.string().max(200).optional(), email: z.string().email().optional(), contact: z.string().regex(/^\+?[0-9]{7,15}$/).optional() }).optional(), notify: z.object({ sms: z.boolean().optional(), email: z.boolean().optional() }).optional(), notes, ...approval } }, async ({approved,...a}) => { enforce('razorpay.payment_link.create',approved,cfg.requireWriteApproval); return ok(await client.mcpCall('create_payment_link',a,false)); });

  server.registerTool('razorpay.refund.get', { description: 'Fetch a refund by ID. READ.', inputSchema: { refund_id: rid } }, async ({refund_id}) => ok(await client.readWithFallback('fetch_refund',{refund_id},`/refunds/${refund_id}`)));
  server.registerTool('razorpay.refund.list', { description: 'List refunds with bounded pagination. READ.', inputSchema: { count, skip, from: unix, to: unix } }, async (a) => ok(await client.readWithFallback('fetch_all_refunds',a,'/refunds',a)));
  server.registerTool('razorpay.refund.create', { description: 'Create a refund for a payment. HIGH_RISK money-moving action. Remote official MCP does not support create_refund, so official REST API is used. Explicit approval required; never auto-retried.', inputSchema: { payment_id: rid, amount: z.number().int().positive().optional(), speed: z.enum(['normal','optimum']).optional(), receipt: z.string().max(100).optional(), notes, ...approval } }, async ({approved,payment_id,...body}) => { enforce('razorpay.refund.create',approved,cfg.requireWriteApproval); return ok(await client.rest('POST',`/payments/${payment_id}/refund`,{body})); });

  server.registerTool('razorpay.settlement.get', { description: 'Fetch settlement details by ID. READ.', inputSchema: { settlement_id: rid } }, async ({settlement_id}) => ok(await client.readWithFallback('fetch_settlement_with_id',{settlement_id},`/settlements/${settlement_id}`)));
  server.registerTool('razorpay.settlement.list', { description: 'List settlements with bounded pagination/time filters. READ.', inputSchema: { count, skip, from: unix, to: unix } }, async (a) => ok(await client.readWithFallback('fetch_all_settlements',a,'/settlements',a)));
  server.registerTool('razorpay.settlement.recon', { description: 'Fetch settlement reconciliation rows for a year/month and optional day. READ. Count is capped at 1000 per official API.', inputSchema: { year: z.number().int().min(2000).max(2100), month: z.number().int().min(1).max(12), day: z.number().int().min(1).max(31).optional(), count: z.number().int().min(1).max(1000).optional(), skip } }, async (a) => ok(await client.readWithFallback('fetch_settlement_recon_details',a,'/settlements/recon/combined',a)));
}
