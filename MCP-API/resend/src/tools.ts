import {z} from 'zod'; import {ResendClient} from './client.js'; import {requireApproval,Risk} from './security.js';
const id=z.string().min(1).max(128); const email=z.string().email();
export type Tool={name:string,risk:Risk,schema:z.ZodTypeAny,run:(a:any,c:ResendClient)=>Promise<any>};
const page=z.object({limit:z.number().int().min(1).max(100).default(20),after:z.string().optional(),before:z.string().optional()});
export const tools:Tool[]=[
{name:'resend.email.send',risk:'HIGH_RISK',schema:z.object({from:z.string().min(3),to:z.array(email).min(1).max(50),subject:z.string().min(1).max(998),html:z.string().max(500000).optional(),text:z.string().max(500000).optional(),replyTo:z.array(email).optional(),approved:z.boolean().default(false)}).refine(x=>x.html||x.text,'html or text required'),run:async(a,c)=>{requireApproval('HIGH_RISK',a.approved);const {approved,...b}=a;return c.request('POST','/emails',b)}},
{name:'resend.email.get',risk:'READ',schema:z.object({id}),run:(a,c)=>c.request('GET',`/emails/${encodeURIComponent(a.id)}`)},
{name:'resend.email.list',risk:'READ',schema:page,run:(a,c)=>c.request('GET','/emails?'+new URLSearchParams(Object.entries(a).filter(([,v])=>v!=null).map(([k,v])=>[k,String(v)])).toString())},
{name:'resend.email.cancel',risk:'HIGH_RISK',schema:z.object({id,approved:z.boolean().default(false)}),run:(a,c)=>{requireApproval('HIGH_RISK',a.approved);return c.request('POST',`/emails/${encodeURIComponent(a.id)}/cancel`)}},
{name:'resend.email.update',risk:'WRITE',schema:z.object({id,scheduledAt:z.string().min(1),approved:z.boolean().default(false)}),run:(a,c)=>{requireApproval('WRITE',a.approved);return c.request('PATCH',`/emails/${encodeURIComponent(a.id)}`,{scheduled_at:a.scheduledAt})}},
{name:'resend.domain.list',risk:'READ',schema:z.object({}),run:(_,c)=>c.request('GET','/domains')},
{name:'resend.domain.get',risk:'READ',schema:z.object({id}),run:(a,c)=>c.request('GET',`/domains/${encodeURIComponent(a.id)}`)},
{name:'resend.contact.list',risk:'READ',schema:z.object({audienceId:id}),run:(a,c)=>c.request('GET',`/audiences/${encodeURIComponent(a.audienceId)}/contacts`)},
{name:'resend.contact.get',risk:'READ',schema:z.object({audienceId:id,contactId:id}),run:(a,c)=>c.request('GET',`/audiences/${encodeURIComponent(a.audienceId)}/contacts/${encodeURIComponent(a.contactId)}`)},
{name:'resend.contact.create',risk:'WRITE',schema:z.object({audienceId:id,email,firstName:z.string().max(100).optional(),lastName:z.string().max(100).optional(),unsubscribed:z.boolean().optional(),approved:z.boolean().default(false)}),run:(a,c)=>{requireApproval('WRITE',a.approved);return c.request('POST',`/audiences/${encodeURIComponent(a.audienceId)}/contacts`,{email:a.email,first_name:a.firstName,last_name:a.lastName,unsubscribed:a.unsubscribed})}},
{name:'resend.contact.update',risk:'WRITE',schema:z.object({audienceId:id,contactId:id,firstName:z.string().max(100).optional(),lastName:z.string().max(100).optional(),unsubscribed:z.boolean().optional(),approved:z.boolean().default(false)}),run:(a,c)=>{requireApproval('WRITE',a.approved);return c.request('PATCH',`/audiences/${encodeURIComponent(a.audienceId)}/contacts/${encodeURIComponent(a.contactId)}`,{first_name:a.firstName,last_name:a.lastName,unsubscribed:a.unsubscribed})}},
{name:'resend.contact.delete',risk:'DESTRUCTIVE',schema:z.object({audienceId:id,contactId:id,approved:z.literal(true)}),run:(a,c)=>{requireApproval('DESTRUCTIVE',a.approved);return c.request('DELETE',`/audiences/${encodeURIComponent(a.audienceId)}/contacts/${encodeURIComponent(a.contactId)}`)}}
];
