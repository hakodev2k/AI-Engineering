import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.number().int().positive();
const page = z.number().int().min(1).max(10000).optional();
const perPage = z.number().int().min(1).max(100).optional();
const approvalToken = z.string().min(8).max(512);
const productPayload = {
  name: z.string().min(1).max(255),
  type: z.enum(["simple", "grouped", "external", "variable"]).default("simple"),
  status: z.enum(["draft", "pending", "private", "publish"]).default("draft"),
  regularPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  description: z.string().max(20000).optional(),
  shortDescription: z.string().max(5000).optional()
};

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; inputSchema: Record<string, unknown> };
const defs: [string, string, Risk, z.ZodTypeAny][] = [
  ["woocommerce.product.list", "List products with bounded pagination and optional search/status filters.", "READ", z.object({ page, perPage, search:z.string().max(200).optional(), status:z.enum(["any","draft","pending","private","publish"]).optional() }).strict()],
  ["woocommerce.product.get", "Get one product by numeric ID.", "READ", z.object({ productId:id }).strict()],
  ["woocommerce.product.create", "Create a product after explicit approval.", "WRITE", z.object({ ...productPayload, approvalToken }).strict()],
  ["woocommerce.product.update", "Update selected product fields after explicit approval.", "WRITE", z.object({ productId:id, name:z.string().min(1).max(255).optional(), status:z.enum(["draft","pending","private","publish"]).optional(), regularPrice:z.string().regex(/^\d+(\.\d{1,2})?$/).optional(), description:z.string().max(20000).optional(), shortDescription:z.string().max(5000).optional(), approvalToken }).strict()],
  ["woocommerce.order.list", "List orders with bounded pagination and optional status/customer filters.", "READ", z.object({ page, perPage, status:z.string().max(50).optional(), customerId:id.optional() }).strict()],
  ["woocommerce.order.get", "Get one order by numeric ID.", "READ", z.object({ orderId:id }).strict()],
  ["woocommerce.order.status.update", "Change an order status after explicit human approval.", "HIGH_RISK", z.object({ orderId:id, status:z.string().min(1).max(50), approvalToken }).strict()],
  ["woocommerce.order.note.add", "Add a private order note after explicit approval.", "WRITE", z.object({ orderId:id, note:z.string().min(1).max(5000), customerNote:z.boolean().default(false), approvalToken }).strict()],
  ["woocommerce.customer.list", "List customers with bounded pagination and optional search.", "READ", z.object({ page, perPage, search:z.string().max(200).optional() }).strict()],
  ["woocommerce.customer.get", "Get one customer by numeric ID.", "READ", z.object({ customerId:id }).strict()],
  ["woocommerce.coupon.list", "List coupons with bounded pagination and optional search.", "READ", z.object({ page, perPage, search:z.string().max(200).optional() }).strict()],
  ["woocommerce.webhook.list", "List configured webhooks without exposing webhook secrets.", "READ", z.object({ page, perPage, status:z.enum(["all","active","paused","disabled"]).optional() }).strict()]
];

function jsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  const shape = (schema as any)._def.shape();
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [key, value] of Object.entries<any>(shape)) {
    const t = value._def?.typeName ?? "";
    let type = "string";
    if (t.includes("Number")) type = "number";
    else if (t.includes("Boolean")) type = "boolean";
    properties[key] = { type };
    if (!value.isOptional()) required.push(key);
  }
  return { type:"object", properties, required, additionalProperties:false };
}

export const TOOLS: ToolDef[] = defs.map(([name, description, risk, schema]) => ({ name, description, risk, schema, inputSchema: jsonSchema(schema) }));
export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
