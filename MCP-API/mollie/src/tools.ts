import { z } from "zod";
import type { MollieClient } from "./client.js";
import { requireApproval, type Risk } from "./policy.js";

const id = (prefix: string) => z.string().regex(new RegExp(`^${prefix}_.+$`));
const money = z.object({ currency: z.string().regex(/^[A-Z]{3}$/), value: z.string().regex(/^\d+\.\d{2}$/) }).strict();
const page = z.object({ from: z.string().optional(), limit: z.number().int().min(1).max(250).default(50) }).strict();

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; run: (a: any) => Promise<any> };

export function buildTools(client: MollieClient): ToolDef[] {
  const read = (name: string, description: string, schema: z.ZodTypeAny, run: (a:any)=>Promise<any>): ToolDef => ({ name, description, risk: "READ", schema, run });
  const guarded = (name: string, description: string, risk: Risk, schema: z.ZodTypeAny, run: (a:any)=>Promise<any>): ToolDef => ({ name, description, risk, schema, run: async a => { requireApproval(risk, a.approval); return run(a); } });
  return [
    read("mollie.payment.list", "List payments with bounded pagination.", page, a => client.request("GET", "/payments", undefined, a)),
    read("mollie.payment.get", "Get a payment by ID.", z.object({ paymentId: id("tr") }).strict(), a => client.request("GET", `/payments/${encodeURIComponent(a.paymentId)}`)),
    guarded("mollie.payment.create", "Create a Mollie payment. Monetary operation; explicit approval required.", "HIGH_RISK", z.object({ amount: money, description: z.string().min(1).max(255), redirectUrl: z.string().url(), webhookUrl: z.string().url().optional(), metadata: z.record(z.unknown()).optional(), approval: z.literal(true) }).strict(), a => client.request("POST", "/payments", { amount: a.amount, description: a.description, redirectUrl: a.redirectUrl, webhookUrl: a.webhookUrl, metadata: a.metadata })),
    read("mollie.payment_link.list", "List payment links.", page, a => client.request("GET", "/payment-links", undefined, a)),
    read("mollie.payment_link.get", "Get a payment link by ID.", z.object({ paymentLinkId: id("pl") }).strict(), a => client.request("GET", `/payment-links/${encodeURIComponent(a.paymentLinkId)}`)),
    guarded("mollie.payment_link.create", "Create a payment link; configurable write approval.", "WRITE", z.object({ description: z.string().min(1).max(255), amount: money.optional(), redirectUrl: z.string().url().optional(), expiresAt: z.string().datetime().optional(), approval: z.boolean().optional() }).strict(), a => client.request("POST", "/payment-links", { description: a.description, amount: a.amount, redirectUrl: a.redirectUrl, expiresAt: a.expiresAt })),
    read("mollie.customer.list", "List customers.", page, a => client.request("GET", "/customers", undefined, a)),
    read("mollie.customer.get", "Get a customer by ID.", z.object({ customerId: id("cst") }).strict(), a => client.request("GET", `/customers/${encodeURIComponent(a.customerId)}`)),
    guarded("mollie.customer.create", "Create a customer record; configurable write approval.", "WRITE", z.object({ name: z.string().max(255).optional(), email: z.string().email().optional(), metadata: z.record(z.unknown()).optional(), approval: z.boolean().optional() }).strict(), a => client.request("POST", "/customers", { name: a.name, email: a.email, metadata: a.metadata })),
    read("mollie.refund.list", "List refunds for a payment.", z.object({ paymentId: id("tr"), from: z.string().optional(), limit: z.number().int().min(1).max(250).default(50) }).strict(), a => client.request("GET", `/payments/${encodeURIComponent(a.paymentId)}/refunds`, undefined, { from: a.from, limit: a.limit })),
    read("mollie.refund.get", "Get a refund by payment and refund ID.", z.object({ paymentId: id("tr"), refundId: id("re") }).strict(), a => client.request("GET", `/payments/${encodeURIComponent(a.paymentId)}/refunds/${encodeURIComponent(a.refundId)}`)),
    guarded("mollie.refund.create", "Refund a payment. Moves funds back to the customer; explicit approval required.", "HIGH_RISK", z.object({ paymentId: id("tr"), amount: money.optional(), description: z.string().max(255).optional(), metadata: z.record(z.unknown()).optional(), approval: z.literal(true) }).strict(), a => client.request("POST", `/payments/${encodeURIComponent(a.paymentId)}/refunds`, { amount: a.amount, description: a.description, metadata: a.metadata })),
  ];
}
