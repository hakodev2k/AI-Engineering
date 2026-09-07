import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.string().min(1).max(255).regex(/^[A-Za-z0-9_.:-]+$/);
const amount = z.string().regex(/^\d+(?:\.\d{1,2})?$/).max(32);
const approvalToken = z.string().min(8).max(512);
const email = z.string().email().max(254);

export type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  permission: string;
  approval: boolean;
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
};

const obj = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false });
const sid = { type: "string", minLength: 1, maxLength: 255, pattern: "^[A-Za-z0-9_.:-]+$" };
const approval = { type: "string", minLength: 8, maxLength: 512 };
const amountSchema = { type: "string", pattern: "^\\d+(?:\\.\\d{1,2})?$", maxLength: 32 };

export const TOOLS: ToolDef[] = [
  { name: "braintree.customer.get", description: "Get one vaulted customer by ID.", risk: "READ", permission: "customer:read", approval: false, schema: z.object({ customerId: id }).strict(), inputSchema: obj({ customerId: sid }, ["customerId"]) },
  { name: "braintree.customer.create", description: "Create a vaulted customer profile without raw payment data.", risk: "WRITE", permission: "customer:write", approval: true, schema: z.object({ customerId: id.optional(), firstName: z.string().max(255).optional(), lastName: z.string().max(255).optional(), company: z.string().max(255).optional(), email: email.optional(), phone: z.string().max(40).optional(), approvalToken }).strict(), inputSchema: obj({ customerId: sid, firstName: {type:"string",maxLength:255}, lastName:{type:"string",maxLength:255}, company:{type:"string",maxLength:255}, email:{type:"string",format:"email",maxLength:254}, phone:{type:"string",maxLength:40}, approvalToken: approval }, ["approvalToken"]) },
  { name: "braintree.customer.update", description: "Update a vaulted customer's non-payment profile fields.", risk: "WRITE", permission: "customer:write", approval: true, schema: z.object({ customerId: id, firstName: z.string().max(255).optional(), lastName: z.string().max(255).optional(), company: z.string().max(255).optional(), email: email.optional(), phone: z.string().max(40).optional(), approvalToken }).strict(), inputSchema: obj({ customerId:sid, firstName:{type:"string",maxLength:255}, lastName:{type:"string",maxLength:255}, company:{type:"string",maxLength:255}, email:{type:"string",format:"email",maxLength:254}, phone:{type:"string",maxLength:40}, approvalToken:approval }, ["customerId","approvalToken"]) },
  { name: "braintree.client_token.create", description: "Generate a client token for Braintree client-side payment collection.", risk: "WRITE", permission: "client-token:create", approval: true, schema: z.object({ customerId: id.optional(), approvalToken }).strict(), inputSchema: obj({ customerId:sid, approvalToken:approval }, ["approvalToken"]) },
  { name: "braintree.transaction.get", description: "Get one transaction by ID.", risk: "READ", permission: "transaction:read", approval: false, schema: z.object({ transactionId: id }).strict(), inputSchema: obj({ transactionId:sid }, ["transactionId"]) },
  { name: "braintree.transaction.sale", description: "Create a sale transaction using a Braintree payment-method nonce; never accepts raw card data.", risk: "HIGH_RISK", permission: "transaction:sale", approval: true, schema: z.object({ amount, paymentMethodNonce: id, orderId: z.string().max(255).optional(), customerId: id.optional(), submitForSettlement: z.boolean().default(false), approvalToken }).strict(), inputSchema: obj({ amount:amountSchema, paymentMethodNonce:sid, orderId:{type:"string",maxLength:255}, customerId:sid, submitForSettlement:{type:"boolean",default:false}, approvalToken:approval }, ["amount","paymentMethodNonce","approvalToken"]) },
  { name: "braintree.transaction.refund", description: "Refund all or part of a settled transaction.", risk: "HIGH_RISK", permission: "transaction:refund", approval: true, schema: z.object({ transactionId: id, amount: amount.optional(), approvalToken }).strict(), inputSchema: obj({ transactionId:sid, amount:amountSchema, approvalToken:approval }, ["transactionId","approvalToken"]) },
  { name: "braintree.transaction.void", description: "Void an eligible transaction before settlement.", risk: "HIGH_RISK", permission: "transaction:void", approval: true, schema: z.object({ transactionId: id, approvalToken }).strict(), inputSchema: obj({ transactionId:sid, approvalToken:approval }, ["transactionId","approvalToken"]) },
  { name: "braintree.subscription.get", description: "Get one recurring-billing subscription by ID.", risk: "READ", permission: "subscription:read", approval: false, schema: z.object({ subscriptionId: id }).strict(), inputSchema: obj({ subscriptionId:sid }, ["subscriptionId"]) },
  { name: "braintree.subscription.cancel", description: "Cancel a recurring-billing subscription.", risk: "HIGH_RISK", permission: "subscription:cancel", approval: true, schema: z.object({ subscriptionId: id, approvalToken }).strict(), inputSchema: obj({ subscriptionId:sid, approvalToken:approval }, ["subscriptionId","approvalToken"]) },
  { name: "braintree.plan.list", description: "List recurring-billing plans available to the merchant.", risk: "READ", permission: "plan:read", approval: false, schema: z.object({}).strict(), inputSchema: obj({}) },
  { name: "braintree.plan.get", description: "Get one recurring-billing plan by ID.", risk: "READ", permission: "plan:read", approval: false, schema: z.object({ planId: id }).strict(), inputSchema: obj({ planId:sid }, ["planId"]) },
  { name: "braintree.merchant_account.get", description: "Get a sub-merchant account by ID when Marketplace capabilities are enabled.", risk: "READ", permission: "merchant-account:read", approval: false, schema: z.object({ merchantAccountId: id }).strict(), inputSchema: obj({ merchantAccountId:sid }, ["merchantAccountId"]) }
];

export const TOOL_MAP = new Map(TOOLS.map(tool => [tool.name, tool]));
