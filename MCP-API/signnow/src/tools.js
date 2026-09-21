import { z } from 'zod';
import { Risk,requireApproval,assertId,assertBase64 } from './policy.js';
const ok=data=>({content:[{type:'text',text:JSON.stringify({data,untrusted_provider_content:true})}]});
const fail=e=>({isError:true,content:[{type:'text',text:JSON.stringify({error:e.message,status:e.status,retry_after:e.retryAfter})}]});
export const toolCatalog=[
 ['signnow.user.get',Risk.READ],['signnow.document.list',Risk.READ],['signnow.document.get',Risk.READ],['signnow.document.upload',Risk.WRITE],['signnow.document.update',Risk.HIGH_RISK],['signnow.document.invite',Risk.HIGH_RISK],['signnow.webhook.list',Risk.READ],['signnow.webhook.create',Risk.HIGH_RISK]
];
export function registerTools(server,client,config){
 const reg=(name,description,schema,risk,fn)=>server.tool(name,description,schema,async a=>{try{requireApproval(config,risk,a.approved);return ok(await fn(a));}catch(e){return fail(e);}});
 reg('signnow.user.get','Get the authenticated SignNow user.',{},Risk.READ,()=>client.user());
 reg('signnow.document.list','List documents with bounded pagination.',{page:z.number().int().min(1).max(10000).default(1),per_page:z.number().int().min(1).max(100).default(50)},Risk.READ,a=>client.documents({page:a.page,perPage:a.per_page}));
 reg('signnow.document.get','Get document metadata by ID.',{document_id:z.string().min(4).max(128)},Risk.READ,a=>client.document(assertId(a.document_id,'document_id')));
 reg('signnow.document.upload','Upload a PDF/document supplied as base64. WRITE; approval required.',{file_name:z.string().min(1).max(200),file_base64:z.string().min(4),approved:z.boolean().default(false)},Risk.WRITE,a=>client.uploadBase64(a.file_name,assertBase64(a.file_base64)));
 reg('signnow.document.update','Update supported document fields. Changes may affect signing workflow; explicit approval required.',{document_id:z.string().min(4).max(128),patch:z.record(z.unknown()),approved:z.boolean().default(false)},Risk.HIGH_RISK,a=>client.updateDocument(assertId(a.document_id,'document_id'),a.patch));
 reg('signnow.document.invite','Send a SignNow signature invite to external recipients. Explicit human approval required.',{document_id:z.string().min(4).max(128),to:z.array(z.object({email:z.string().email(),role:z.string().min(1).max(100),order:z.number().int().min(1).max(100).optional()})).min(1).max(50),from:z.string().email(),subject:z.string().max(200).optional(),message:z.string().max(5000).optional(),approved:z.boolean().default(false)},Risk.HIGH_RISK,a=>client.invite(assertId(a.document_id,'document_id'),{to:a.to,from:a.from,subject:a.subject,message:a.message}));
 reg('signnow.webhook.list','List configured SignNow event subscriptions.',{},Risk.READ,()=>client.webhooks());
 reg('signnow.webhook.create','Create an event subscription. Callback must use HTTPS; explicit approval required.',{event:z.string().min(3).max(100),callback_url:z.string().url().refine(v=>v.startsWith('https://'),'HTTPS required'),entity_id:z.string().max(128).optional(),approved:z.boolean().default(false)},Risk.HIGH_RISK,a=>client.createWebhook({event:a.event,callback_url:a.callback_url,entity_id:a.entity_id}));
}
