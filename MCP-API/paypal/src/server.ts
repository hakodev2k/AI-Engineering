import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { PayPalTokenProvider } from "./auth.js";
import { PayPalUpstream } from "./upstream.js";
import { assertApproved, operationTarget, type Risk } from "./policy.js";

const config = loadConfig();
const tokens = new PayPalTokenProvider(config);
const upstream = new PayPalUpstream(config, tokens);
const server = new McpServer({ name: "paypal-mcp-connector", version: "1.0.0" });

const approvalFields = {
  approvalToken: z.string().min(20).max(256).optional(),
  approvalExpiresAt: z.number().int().positive().optional()
};

const id = z.string().min(3).max(127).regex(/^[A-Za-z0-9_-]+$/);
const currency = z.string().regex(/^[A-Z]{3}$/);
const item = z.object({
  name: z.string().min(1).max(200),
  quantity: z.number().positive().max(1_000_000),
  unit_price: z.number().nonnegative().max(1_000_000_000)
});

function register(
  name: string,
  description: string,
  schema: Record<string, z.ZodTypeAny>,
  upstreamName: string,
  risk: Risk,
  transform?: (args: Record<string, unknown>) => Record<string, unknown>
): void {
  server.tool(name, description, schema, async (raw: Record<string, unknown>) => {
    const clean = transform ? transform(raw) : { ...raw };
    delete clean.approvalToken;
    delete clean.approvalExpiresAt;
    const target = operationTarget(clean);
    assertApproved(
      config,
      name,
      target,
      raw.approvalToken as string | undefined,
      raw.approvalExpiresAt as number | undefined
    );
    const result = await upstream.call(upstreamName, clean, risk);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ source: "paypal-official-mcp", untrusted_provider_data: true, result })
      }]
    };
  });
}

register("paypal.invoice.list", "List PayPal invoices. READ.", {
  page: z.number().int().min(1).max(100000).optional(),
  page_size: z.number().int().min(1).max(100).optional(),
  status: z.string().min(2).max(32).regex(/^[A-Z_]+$/).optional()
}, "list_invoices", "READ");

register("paypal.invoice.get", "Get one PayPal invoice by ID. READ.", { invoice_id: id }, "get_invoice", "READ");

register("paypal.invoice.create", "Create a draft PayPal invoice. WRITE; approval required by default.", {
  recipient_email: z.string().email().max(254),
  items: z.array(item).min(1).max(100),
  ...approvalFields
}, "create_invoice", "WRITE");

register("paypal.invoice.send", "Send an existing PayPal invoice to its recipient. HIGH_RISK; explicit approval required.", {
  invoice_id: id,
  ...approvalFields
}, "send_invoice", "HIGH_RISK");

register("paypal.invoice.remind", "Send a reminder for an existing PayPal invoice. HIGH_RISK; explicit approval required.", {
  invoice_id: id,
  ...approvalFields
}, "send_invoice_reminder", "HIGH_RISK");

register("paypal.invoice.cancel", "Cancel a sent PayPal invoice. HIGH_RISK; explicit approval required.", {
  invoice_id: id,
  ...approvalFields
}, "cancel_sent_invoice", "HIGH_RISK");

register("paypal.order.create", "Create a PayPal order without capturing funds. WRITE; approval required by default.", {
  items: z.array(item).min(1).max(100),
  currency,
  ...approvalFields
}, "create_order", "WRITE");

register("paypal.order.get", "Get PayPal order details. READ.", { order_id: id }, "get_order", "READ");

register("paypal.order.capture", "Capture payment for an approved/authorized PayPal order. HIGH_RISK financial action; explicit approval required.", {
  order_id: id,
  ...approvalFields
}, "pay_order", "HIGH_RISK");

register("paypal.refund.create", "Refund a captured PayPal payment. HIGH_RISK financial action; explicit approval required.", {
  capture_id: id,
  amount: z.number().positive().max(1_000_000_000).optional(),
  currency: currency.optional(),
  ...approvalFields
}, "create_refund", "HIGH_RISK", (args) => {
  if ((args.amount === undefined) !== (args.currency === undefined)) {
    throw new Error("amount and currency must be provided together for a partial refund; omit both for a full refund.");
  }
  return { ...args };
});

register("paypal.refund.get", "Get PayPal refund details. READ.", { refund_id: id }, "get_refund", "READ");

register("paypal.dispute.list", "List PayPal disputes with an optional status filter. READ.", {
  status: z.string().min(2).max(40).regex(/^[A-Z_]+$/).optional()
}, "list_disputes", "READ");

register("paypal.dispute.get", "Get a PayPal dispute by ID. READ.", { dispute_id: id }, "get_dispute", "READ");

register("paypal.dispute.accept", "Accept a PayPal dispute claim in favor of the buyer. HIGH_RISK irreversible business action; explicit approval required.", {
  dispute_id: id,
  ...approvalFields
}, "accept_dispute_claim", "HIGH_RISK");

process.on("SIGINT", async () => { await upstream.close(); process.exit(0); });
process.on("SIGTERM", async () => { await upstream.close(); process.exit(0); });

await server.connect(new StdioServerTransport());
