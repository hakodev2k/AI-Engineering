import { z } from 'zod';
import { TelnyxClient } from './client.js';
import { e164,id,requireApproval,type Risk } from './security.js';

export type ToolDef={name:string,description:string,risk:Risk,schema:z.ZodTypeAny,run:(c:TelnyxClient,a:any)=>Promise<any>};
const approved=z.boolean().optional();
export const tools:ToolDef[]=[
 {name:'telnyx.phone_number.search',description:'Search purchasable phone numbers.',risk:'READ',schema:z.object({countryCode:z.string().length(2),contains:z.string().max(20).optional(),limit:z.number().int().min(1).max(100).default(20)}),run:(c,a)=>c.request('GET',`/available_phone_numbers?filter[country_code]=${encodeURIComponent(a.countryCode)}&filter[contains]=${encodeURIComponent(a.contains??'')}&page[size]=${a.limit}`)},
 {name:'telnyx.phone_number.list',description:'List owned phone numbers.',risk:'READ',schema:z.object({pageSize:z.number().int().min(1).max(100).default(20),pageNumber:z.number().int().min(1).default(1)}),run:(c,a)=>c.request('GET',`/phone_numbers?page[size]=${a.pageSize}&page[number]=${a.pageNumber}`)},
 {name:'telnyx.messaging_profile.list',description:'List messaging profiles.',risk:'READ',schema:z.object({pageSize:z.number().int().min(1).max(100).default(20)}),run:(c,a)=>c.request('GET',`/messaging_profiles?page[size]=${a.pageSize}`)},
 {name:'telnyx.message.get',description:'Get an outbound/inbound message by ID.',risk:'READ',schema:z.object({messageId:id}),run:(c,a)=>c.request('GET',`/messages/${a.messageId}`)},
 {name:'telnyx.message.send',description:'Send SMS/MMS. External communication; approval required.',risk:'HIGH_RISK',schema:z.object({from:e164,to:e164,text:z.string().min(1).max(5000),mediaUrls:z.array(z.string().url().refine(u=>u.startsWith('https://'))).max(10).optional(),approved}),run:(c,a)=>{requireApproval('HIGH_RISK',a.approved);return c.request('POST','/messages',{from:a.from,to:a.to,text:a.text,media_urls:a.mediaUrls})}},
 {name:'telnyx.call.get',description:'Get Call Control call state.',risk:'READ',schema:z.object({callControlId:id}),run:(c,a)=>c.request('GET',`/calls/${a.callControlId}`)},
 {name:'telnyx.call.create',description:'Initiate an outbound call. Approval required.',risk:'HIGH_RISK',schema:z.object({connectionId:id,from:e164,to:e164,webhookUrl:z.string().url().refine(u=>u.startsWith('https://')),approved}),run:(c,a)=>{requireApproval('HIGH_RISK',a.approved);return c.request('POST','/calls',{connection_id:a.connectionId,from:a.from,to:a.to,webhook_url:a.webhookUrl})}},
 {name:'telnyx.call.hangup',description:'Hang up an active call. Approval required.',risk:'HIGH_RISK',schema:z.object({callControlId:id,approved}),run:(c,a)=>{requireApproval('HIGH_RISK',a.approved);return c.request('POST',`/calls/${a.callControlId}/actions/hangup`,{})}},
 {name:'telnyx.assistant.list',description:'List AI Assistants.',risk:'READ',schema:z.object({pageSize:z.number().int().min(1).max(100).default(20)}),run:(c,a)=>c.request('GET',`/ai/assistants?page[size]=${a.pageSize}`)},
 {name:'telnyx.assistant.get',description:'Get an AI Assistant.',risk:'READ',schema:z.object({assistantId:id}),run:(c,a)=>c.request('GET',`/ai/assistants/${a.assistantId}`)}
];
export async function executeTool(name:string,args:unknown,client=new TelnyxClient()){
 const t=tools.find(x=>x.name===name); if(!t) throw new Error('Unknown tool'); const parsed=t.schema.parse(args); return t.run(client,parsed);
}
