import {z} from 'zod';import {Risk,authorize} from './policy.js';
const id=z.string().min(1).max(200);const email=z.string().email();const page=z.object({limit:z.number().int().min(1).max(100).default(20),cursor:z.string().max(500).optional(),search:z.string().max(320).optional()});
const qs=o=>{const p=new URLSearchParams();for(const[k,v]of Object.entries(o))if(v!==undefined)p.set(k,String(v));return p.toString()};
export function toolDefinitions(client,config){
 const d=(name,description,schema,risk,run)=>({name:`plunk.${name}`,description,inputSchema:schema,risk,run:async input=>{const parsed=schema.parse(input);authorize(config,risk,parsed.approved);return run(parsed)}});
 return [
 d('contact.list','List/search contacts with cursor pagination.',page,Risk.READ,x=>client.request(`/contacts?${qs(x)}`)),
 d('contact.get','Get a contact by ID.',z.object({id}),Risk.READ,x=>client.request(`/contacts/${encodeURIComponent(x.id)}`)),
 d('contact.create','Create or upsert a contact.',z.object({email,subscribed:z.boolean().optional(),data:z.record(z.unknown()).optional()}),Risk.WRITE,x=>client.request('/contacts',{method:'POST',body:x})),
 d('contact.update','Update contact fields.',z.object({id,email:email.optional(),subscribed:z.boolean().optional(),data:z.record(z.unknown()).optional()}),Risk.WRITE,x=>{const{id,...body}=x;return client.request(`/contacts/${encodeURIComponent(id)}`,{method:'PATCH',body})}),
 d('email.verify','Validate an email address.',z.object({email}),Risk.READ,x=>client.request('/v1/verify',{method:'POST',body:x})),
 d('email.send','Send transactional email. External communication requires explicit human approval.',z.object({to:z.union([email,z.array(email).min(1).max(50)]),subject:z.string().min(1).max(998).optional(),body:z.string().min(1).max(5_000_000).optional(),template:z.string().max(200).optional(),from:email.optional(),data:z.record(z.unknown()).optional(),approved:z.literal(true)}).refine(x=>x.template||(x.subject&&x.body),{message:'template or subject+body required'}),Risk.HIGH_RISK,x=>{const{approved,...body}=x;return client.request('/v1/send',{method:'POST',body})}),
 d('template.list','List reusable templates.',z.object({}),Risk.READ,()=>client.request('/templates')),
 d('campaign.list','List campaigns.',z.object({}),Risk.READ,()=>client.request('/campaigns')),
 d('campaign.get','Get campaign metadata.',z.object({id}),Risk.READ,x=>client.request(`/campaigns/${encodeURIComponent(x.id)}`)),
 d('campaign.stats','Get campaign send/open/click/bounce statistics.',z.object({id}),Risk.READ,x=>client.request(`/campaigns/${encodeURIComponent(x.id)}/stats`)),
 d('segment.list','List audience segments.',z.object({}),Risk.READ,()=>client.request('/segments')),
 d('activity.list','Read cross-resource email activity.',z.object({limit:z.number().int().min(1).max(100).default(20),cursor:z.string().max(500).optional()}),Risk.READ,x=>client.request(`/activity?${qs(x)}`)),
 d('analytics.timeseries','Read email send/open/click time-series.',z.object({from:z.string().datetime().optional(),to:z.string().datetime().optional()}),Risk.READ,x=>client.request(`/analytics/timeseries?${qs(x)}`)),
 d('campaign.test','Send a campaign test email to one address; requires approval.',z.object({id,email,approved:z.literal(true)}),Risk.HIGH_RISK,x=>client.request(`/campaigns/${encodeURIComponent(x.id)}/test`,{method:'POST',body:{email:x.email}})),
 d('campaign.send','Send or schedule a campaign; requires explicit approval.',z.object({id,scheduledFor:z.string().datetime().optional(),approved:z.literal(true)}),Risk.HIGH_RISK,x=>client.request(`/campaigns/${encodeURIComponent(x.id)}/send`,{method:'POST',body:x.scheduledFor?{scheduledFor:x.scheduledFor}:{}}))
 ];
}
