import {z} from 'zod';import {DixaClient,type Risk} from './client.js';
const id=z.string().uuid();const cid=z.coerce.number().int().positive();const page=z.object({limit:z.number().int().min(1).max(100).optional(),after:z.string().max(500).optional()});
export type Tool={description:string,risk:Risk,schema:z.ZodTypeAny,run:(c:DixaClient,a:any)=>Promise<unknown>};
const qs=(a:any)=>{const p=new URLSearchParams();if(a.limit)p.set('limit',String(a.limit));if(a.after)p.set('after',a.after);return p.size?'?'+p:''};
export const tools:Record<string,Tool>={
'dixa.conversation.get':{description:'Get one conversation.',risk:'READ',schema:z.object({conversationId:cid}),run:(c,a)=>c.request('GET',`/v1/conversations/${a.conversationId}`)},
'dixa.conversation.messages.list':{description:'List messages in a conversation.',risk:'READ',schema:z.object({conversationId:cid}).merge(page),run:(c,a)=>c.request('GET',`/v1/conversations/${a.conversationId}/messages${qs(a)}`)},
'dixa.conversation.notes.list':{description:'List internal notes.',risk:'READ',schema:z.object({conversationId:cid}).merge(page),run:(c,a)=>c.request('GET',`/v1/conversations/${a.conversationId}/notes${qs(a)}`)},
'dixa.conversation.linked.list':{description:'List linked child conversations.',risk:'READ',schema:z.object({conversationId:cid}),run:(c,a)=>c.request('GET',`/v1/conversations/${a.conversationId}/linked`)},
'dixa.conversation.note.create':{description:'Add an internal note; write approval policy applies.',risk:'WRITE',schema:z.object({conversationId:cid,text:z.string().min(1).max(10000)}),run:(c,a)=>c.request('POST',`/v1/conversations/${a.conversationId}/notes`,'WRITE',{text:a.text})},
'dixa.conversation.reopen':{description:'Reopen a closed conversation.',risk:'WRITE',schema:z.object({conversationId:cid}),run:(c,a)=>c.request('PUT',`/v1/conversations/${a.conversationId}/reopen`,'WRITE')},
'dixa.conversation.transfer.queue':{description:'Transfer a conversation to a queue; explicit approval required.',risk:'HIGH_RISK',schema:z.object({conversationId:cid,queueId:id,approval:z.string().min(1)}),run:(c,a)=>c.request('PUT',`/v1/conversations/${a.conversationId}/transfer/queue`,'HIGH_RISK',{queueId:a.queueId},a.approval)},
'dixa.enduser.list':{description:'List/search end users.',risk:'READ',schema:page.extend({email:z.string().email().optional(),phone:z.string().max(40).optional()}),run:(c,a)=>{const p=new URLSearchParams();if(a.limit)p.set('limit',String(a.limit));if(a.after)p.set('after',a.after);if(a.email)p.set('email',a.email);if(a.phone)p.set('phone',a.phone);return c.request('GET','/v1/endusers'+(p.size?'?'+p:''))}},
'dixa.enduser.get':{description:'Get an end user.',risk:'READ',schema:z.object({userId:id}),run:(c,a)=>c.request('GET',`/v1/endusers/${a.userId}`)},
'dixa.enduser.conversations.list':{description:'List conversations requested by an end user.',risk:'READ',schema:z.object({userId:id}).merge(page),run:(c,a)=>c.request('GET',`/v1/endusers/${a.userId}/conversations${qs(a)}`)},
'dixa.agent.list':{description:'List agents/admins.',risk:'READ',schema:page,run:(c,a)=>c.request('GET','/v1/agents'+qs(a))},
'dixa.agent.get':{description:'Get an agent/admin.',risk:'READ',schema:z.object({agentId:id}),run:(c,a)=>c.request('GET',`/v1/agents/${a.agentId}`)},
'dixa.queue.list':{description:'List queues.',risk:'READ',schema:page,run:(c,a)=>c.request('GET','/v1/queues'+qs(a))},
'dixa.queue.get':{description:'Get a queue.',risk:'READ',schema:z.object({queueId:id}),run:(c,a)=>c.request('GET',`/v1/queues/${a.queueId}`)},
'dixa.tag.list':{description:'List tags.',risk:'READ',schema:page,run:(c,a)=>c.request('GET','/v1/tags'+qs(a))}
};