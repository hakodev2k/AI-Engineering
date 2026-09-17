import {z} from 'zod';
const id=z.string().uuid(), approval=z.object({confirmed:z.literal(true),reason:z.string().min(8).max(500)}).strict();
export const tools=[
 ['configcat.product.list','READ',z.object({}).strict(),a=>['GET','/v1/products']],
 ['configcat.environment.list','READ',z.object({productId:id}).strict(),a=>['GET',`/v1/products/${a.productId}/environments`]],
 ['configcat.config.list','READ',z.object({productId:id}).strict(),a=>['GET',`/v1/products/${a.productId}/configs`]],
 ['configcat.flag.list','READ',z.object({configId:id}).strict(),a=>['GET',`/v1/configs/${a.configId}/settings`]],
 ['configcat.flag.value.get','READ',z.object({environmentId:id,settingId:id,version:z.enum(['v1','v2']).default('v1')}).strict(),a=>['GET',`/${a.version}/environments/${a.environmentId}/settings/${a.settingId}/value`]],
 ['configcat.segment.list','READ',z.object({productId:id}).strict(),a=>['GET',`/v1/products/${a.productId}/segments`]],
 ['configcat.webhook.list','READ',z.object({productId:id}).strict(),a=>['GET',`/v1/products/${a.productId}/webhooks`]],
 ['configcat.integration.list','READ',z.object({productId:id}).strict(),a=>['GET',`/v1/products/${a.productId}/integrations`]],
 ['configcat.audit.list','READ',z.object({productId:id,configId:id.optional(),environmentId:id.optional(),fromUtcDateTime:z.string().datetime().optional(),toUtcDateTime:z.string().datetime().optional()}).strict(),a=>['GET',`/v1/products/${a.productId}/auditlogs`,{configId:a.configId,environmentId:a.environmentId,fromUtcDateTime:a.fromUtcDateTime,toUtcDateTime:a.toUtcDateTime}]],
 ['configcat.flag.value.update','HIGH_RISK',z.object({environmentId:id,settingId:id,version:z.enum(['v1','v2']).default('v1'),patch:z.array(z.object({op:z.enum(['add','remove','replace','move','copy','test']),path:z.string().regex(/^\/(value|rolloutRules|percentageRules|defaultValue|targetingRules|percentageEvaluationAttribute)(\/.*)?$/),from:z.string().optional(),value:z.unknown().optional()}).strict()).min(1).max(20),reason:z.string().min(1).max(1000).optional(),approval}).strict(),a=>['PATCH',`/${a.version}/environments/${a.environmentId}/settings/${a.settingId}/value`,a.patch,{reason:a.reason}]]
];
export function registry(client,config){return new Map(tools.map(([name,risk,schema,route])=>[name,{risk,schema,async run(raw){const a=schema.parse(raw);if(risk==='HIGH_RISK'&&(!config.allowHighRisk||!a.approval?.confirmed))throw new Error('Explicit human approval and CONFIGCAT_ALLOW_HIGH_RISK=true are required');const [method,path,x,y]=route(a);const opts=method==='GET'?{query:x}:{body:x,query:y,retry:false};const out=await client.request(method,path,opts);return {provider:'ConfigCat',untrustedProviderData:out.data,rateLimit:out.rateLimit};}}]));}
