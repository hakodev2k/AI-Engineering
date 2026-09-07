import { z } from 'zod';
import type { Risk } from './policy.js';
const id=z.string().min(1).max(200).regex(/^[A-Za-z0-9_.:-]+$/);
const pageSize=z.number().int().min(1).max(100).default(10);
const pageNumber=z.number().int().min(1).max(100000).default(1);
const approvalToken=z.string().min(64).max(128).optional();
export type ToolDef={name:string;upstream:string;description:string;risk:Risk;schema:z.ZodTypeAny;inputSchema:Record<string,unknown>};
const defs:[string,string,string,Risk,z.ZodTypeAny][]=[
['adyen.merchant.list','list_merchant_accounts','List merchant accounts with bounded pagination.','READ',z.object({pageSize,pageNumber}).strict()],
['adyen.merchant.get','get_merchant_account','Get one merchant account.','READ',z.object({merchantId:id}).strict()],
['adyen.payment_link.create','create_payment_links','Create a hosted payment link.','WRITE',z.object({currency:z.string().length(3).transform(v=>v.toUpperCase()),value:z.number().int().positive(),merchantAccount:id,countryCode:z.string().length(2).transform(v=>v.toUpperCase()),reference:z.string().min(1).max(80),approvalToken}).strict()],
['adyen.payment_link.get','get_payment_link','Get payment-link status/details.','READ',z.object({linkId:id}).strict()],
['adyen.payment_link.expire','update_payment_link','Expire an existing payment link.','HIGH_RISK',z.object({linkId:id,approvalToken}).strict()],
['adyen.payment.cancel','cancel_payment','Cancel an authorized payment before capture.','HIGH_RISK',z.object({paymentReference:id,approvalToken}).strict()],
['adyen.payment.refund','refund_payment','Refund a captured payment.','HIGH_RISK',z.object({paymentPspReference:id,currency:z.string().length(3).transform(v=>v.toUpperCase()),value:z.number().int().positive(),merchantAccount:id,reference:z.string().min(1).max(80),approvalToken}).strict()],
['adyen.webhook.company.list','list_all_company_webhooks','List company webhook configurations.','READ',z.object({companyId:id,pageSize,pageNumber}).strict()],
['adyen.webhook.company.get','get_company_webhook','Get one company webhook configuration.','READ',z.object({companyId:id,webhookId:id}).strict()],
['adyen.webhook.merchant.list','list_all_merchant_webhooks','List merchant webhook configurations.','READ',z.object({merchantId:id,pageSize,pageNumber}).strict()],
['adyen.webhook.merchant.get','get_merchant_webhook','Get one merchant webhook configuration.','READ',z.object({merchantId:id,webhookId:id}).strict()]
];
const js=(schema:z.ZodTypeAny)=>{const shape=(schema as any)._def.shape();const properties:Record<string,unknown>={};const required:string[]=[];for(const [k,v] of Object.entries<any>(shape)){const t=v._def?.typeName||'';properties[k]={type:t.includes('Number')?'number':t.includes('Boolean')?'boolean':'string'};if(!v.isOptional?.()&&!v._def?.defaultValue)required.push(k);}return{type:'object',properties,required,additionalProperties:false};};
export const TOOLS:ToolDef[]=defs.map(([name,upstream,description,risk,schema])=>({name,upstream,description,risk,schema,inputSchema:js(schema)}));
export const TOOL_MAP=new Map(TOOLS.map(t=>[t.name,t]));
