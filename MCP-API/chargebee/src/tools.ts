import { z } from "zod";
import type { Risk } from "./policy.js";
const id = z.string().min(1).max(200).regex(/^[^/?#]+$/);
const limit = z.number().int().min(1).max(100).optional();
const offset = z.string().min(1).max(1000).optional();
const approvalToken = z.string().min(8).max(512);
const pagination = { limit, offset };
const customerFields = { email:z.string().email().optional(), firstName:z.string().max(150).optional(), lastName:z.string().max(150).optional(), company:z.string().max(250).optional() };
export type ToolDef={name:string;description:string;risk:Risk;schema:z.ZodTypeAny;inputSchema:Record<string,unknown>};
const defs:[string,string,Risk,z.ZodTypeAny][] = [
 ["chargebee.customer.list","List customers with bounded pagination.","READ",z.object(pagination).strict()],
 ["chargebee.customer.get","Get one customer.","READ",z.object({customerId:id}).strict()],
 ["chargebee.customer.create","Create a customer after explicit approval.","WRITE",z.object({customerId:id.optional(),...customerFields,approvalToken}).strict()],
 ["chargebee.customer.update","Update customer profile fields after explicit approval.","WRITE",z.object({customerId:id,...customerFields,approvalToken}).strict()],
 ["chargebee.subscription.list","List subscriptions.","READ",z.object(pagination).strict()],
 ["chargebee.subscription.get","Get one subscription.","READ",z.object({subscriptionId:id}).strict()],
 ["chargebee.subscription.cancel","Cancel a subscription; billing-impacting high-risk action.","HIGH_RISK",z.object({subscriptionId:id,endOfTerm:z.boolean().default(true),approvalToken}).strict()],
 ["chargebee.subscription.pause","Pause a subscription; billing-impacting high-risk action.","HIGH_RISK",z.object({subscriptionId:id,pauseOption:z.enum(["immediately","end_of_term"]),approvalToken}).strict()],
 ["chargebee.subscription.resume","Resume a paused subscription immediately after explicit approval.","HIGH_RISK",z.object({subscriptionId:id,resumeOption:z.literal("immediately").default("immediately"),approvalToken}).strict()],
 ["chargebee.invoice.list","List invoices.","READ",z.object(pagination).strict()],
 ["chargebee.invoice.get","Get one invoice.","READ",z.object({invoiceId:id}).strict()],
 ["chargebee.credit_note.list","List credit notes.","READ",z.object(pagination).strict()],
 ["chargebee.transaction.list","List transactions.","READ",z.object(pagination).strict()],
 ["chargebee.item_price.list","List item prices from Product Catalog 2.0.","READ",z.object(pagination).strict()]
];
function jsonSchema(schema:z.ZodTypeAny){ const shape=(schema as any)._def.shape(); const properties:Record<string,unknown>={}; const required:string[]=[]; for(const [k,v] of Object.entries<any>(shape)){ const d=v._def; const type=d.typeName?.includes("Number")?"number":d.typeName?.includes("Boolean")?"boolean":"string"; properties[k]={type}; if(!v.isOptional()) required.push(k); } return {type:"object",properties,required,additionalProperties:false}; }
export const TOOLS:ToolDef[]=defs.map(([name,description,risk,schema])=>({name,description,risk,schema,inputSchema:jsonSchema(schema)}));
export const TOOL_MAP=new Map(TOOLS.map(t=>[t.name,t]));
