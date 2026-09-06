import { z } from "zod";
import type { Risk } from "./policy.js";

const page = { limit: z.number().int().min(1).max(200).optional(), cursor: z.string().min(1).max(500).optional() };
const approval = { approved: z.boolean().optional().describe("Human approval captured outside the model.") };
const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; inputSchema: Record<string, unknown> };
function obj(shape: Record<string, z.ZodTypeAny>) { return z.object(shape).strict(); }
function jsonSchema(properties: Record<string, unknown>, required: string[] = []) { return { type: "object", additionalProperties: false, properties, ...(required.length ? { required } : {}) }; }
const s = { type: "string" }, b = { type: "boolean" }, n = { type: "integer" };

export const TOOLS: ToolDef[] = [
  { name:"recurly.account.list", description:"List customer accounts with bounded pagination.", risk:"READ", schema:obj({...page, state:z.enum(["active","closed"]).optional()}), inputSchema:jsonSchema({limit:{...n,minimum:1,maximum:200},cursor:s,state:{type:"string",enum:["active","closed"]}}) },
  { name:"recurly.account.get", description:"Fetch one account by Recurly ID or code-prefixed identifier.", risk:"READ", schema:obj({accountId:id}), inputSchema:jsonSchema({accountId:s},["accountId"]) },
  { name:"recurly.account.create", description:"Create a customer account without payment credentials.", risk:"WRITE", schema:obj({code:z.string().min(1).max(50),email:z.string().email().max(255).optional(),firstName:z.string().max(255).optional(),lastName:z.string().max(255).optional(),company:z.string().max(100).optional(),...approval}), inputSchema:jsonSchema({code:{...s,maxLength:50},email:s,firstName:s,lastName:s,company:s,approved:b},["code"]) },
  { name:"recurly.account.update", description:"Update non-payment account profile fields.", risk:"WRITE", schema:obj({accountId:id,email:z.string().email().max(255).optional(),firstName:z.string().max(255).optional(),lastName:z.string().max(255).optional(),company:z.string().max(100).optional(),...approval}).refine(v=>v.email!==undefined||v.firstName!==undefined||v.lastName!==undefined||v.company!==undefined,"At least one update field is required."), inputSchema:jsonSchema({accountId:s,email:s,firstName:s,lastName:s,company:s,approved:b},["accountId"]) },
  { name:"recurly.subscription.list", description:"List subscriptions, optionally filtered by state.", risk:"READ", schema:obj({...page,state:z.enum(["active","canceled","expired","failed","future","paused"]).optional()}), inputSchema:jsonSchema({limit:{...n,minimum:1,maximum:200},cursor:s,state:{type:"string",enum:["active","canceled","expired","failed","future","paused"]}}) },
  { name:"recurly.subscription.get", description:"Fetch one subscription by ID or uuid-prefixed identifier.", risk:"READ", schema:obj({subscriptionId:id}), inputSchema:jsonSchema({subscriptionId:s},["subscriptionId"]) },
  { name:"recurly.subscription.cancel", description:"Cancel a subscription at its provider-defined cancellation boundary; this changes future billing.", risk:"HIGH_RISK", schema:obj({subscriptionId:id,...approval}), inputSchema:jsonSchema({subscriptionId:s,approved:b},["subscriptionId"]) },
  { name:"recurly.subscription.pause", description:"Schedule a subscription pause for a bounded number of billing cycles.", risk:"HIGH_RISK", schema:obj({subscriptionId:id,remainingPauseCycles:z.number().int().min(1).max(12),...approval}), inputSchema:jsonSchema({subscriptionId:s,remainingPauseCycles:{...n,minimum:1,maximum:12},approved:b},["subscriptionId","remainingPauseCycles"]) },
  { name:"recurly.invoice.list", description:"List invoices with bounded pagination.", risk:"READ", schema:obj({...page,state:z.enum(["open","pending","processing","past_due","paid","failed","voided"]).optional()}), inputSchema:jsonSchema({limit:{...n,minimum:1,maximum:200},cursor:s,state:s}) },
  { name:"recurly.invoice.get", description:"Fetch one invoice by ID or number-prefixed identifier.", risk:"READ", schema:obj({invoiceId:id}), inputSchema:jsonSchema({invoiceId:s},["invoiceId"]) },
  { name:"recurly.plan.list", description:"List plans for catalog discovery.", risk:"READ", schema:obj({...page,state:z.enum(["active","inactive"]).optional()}), inputSchema:jsonSchema({limit:{...n,minimum:1,maximum:200},cursor:s,state:{type:"string",enum:["active","inactive"]}}) },
  { name:"recurly.transaction.list", description:"List payment transactions for support and reconciliation workflows.", risk:"READ", schema:obj({...page,type:z.enum(["authorization","capture","purchase","refund","verify"]).optional()}), inputSchema:jsonSchema({limit:{...n,minimum:1,maximum:200},cursor:s,type:s}) }
];
export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
