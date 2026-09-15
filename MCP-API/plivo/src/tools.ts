import {z} from 'zod';import {PlivoClient} from './client.js';import {authorize,e164,page,untrusted,uuid,Risk} from './core.js';
export type Tool={name:string;purpose:string;risk:Risk;approval:boolean;schema:z.ZodTypeAny;run:(a:any,c:PlivoClient)=>Promise<any>};const qs=(a:any)=>new URLSearchParams({limit:String(a.limit),offset:String(a.offset)}).toString();const https=z.string().url().refine(x=>new URL(x).protocol==='https:','HTTPS URL required');
export const tools:Tool[]=[
{name:'plivo.message.list',purpose:'List message records',risk:'READ',approval:false,schema:page,run:async(a,c)=>untrusted(await c.request('GET',`Message/?${qs(a)}`))},
{name:'plivo.message.get',purpose:'Get a message record',risk:'READ',approval:false,schema:z.object({message_uuid:uuid}),run:async(a,c)=>untrusted(await c.request('GET',`Message/${a.message_uuid}/`))},
{name:'plivo.message.send',purpose:'Send SMS/MMS text',risk:'HIGH_RISK',approval:true,schema:z.object({src:e164,dst:e164,text:z.string().min(1).max(1600),approved:z.literal(true)}),run:async(a,c)=>{authorize('HIGH_RISK',a.approved);const{approved,...body}=a;return c.request('POST','Message/',body)}},
{name:'plivo.call.list',purpose:'List completed calls',risk:'READ',approval:false,schema:page,run:async(a,c)=>untrusted(await c.request('GET',`Call/?${qs(a)}`))},
{name:'plivo.call.get',purpose:'Get a live or completed call',risk:'READ',approval:false,schema:z.object({call_uuid:uuid}),run:async(a,c)=>untrusted(await c.request('GET',`Call/${a.call_uuid}/`))},
{name:'plivo.call.create',purpose:'Start an outbound call',risk:'HIGH_RISK',approval:true,schema:z.object({from:e164,to:e164,answer_url:https,answer_method:z.enum(['GET','POST']).default('POST'),approved:z.literal(true)}),run:async(a,c)=>{authorize('HIGH_RISK',a.approved);const{approved,...body}=a;return c.request('POST','Call/',body)}},
{name:'plivo.call.hangup',purpose:'Terminate an active call',risk:'HIGH_RISK',approval:true,schema:z.object({call_uuid:uuid,approved:z.literal(true)}),run:async(a,c)=>{authorize('HIGH_RISK',a.approved);return c.request('DELETE',`Call/${a.call_uuid}/`)}},
{name:'plivo.recording.list',purpose:'List call recordings',risk:'READ',approval:false,schema:page,run:async(a,c)=>untrusted(await c.request('GET',`Recording/?${qs(a)}`))},
{name:'plivo.recording.get',purpose:'Get recording metadata',risk:'READ',approval:false,schema:z.object({recording_id:uuid}),run:async(a,c)=>untrusted(await c.request('GET',`Recording/${a.recording_id}/`))},
{name:'plivo.application.list',purpose:'List voice applications',risk:'READ',approval:false,schema:page,run:async(a,c)=>untrusted(await c.request('GET',`Application/?${qs(a)}`))},
{name:'plivo.application.get',purpose:'Get voice application configuration',risk:'READ',approval:false,schema:z.object({app_id:z.string().min(1).max(64).regex(/^\d+$/)}),run:async(a,c)=>untrusted(await c.request('GET',`Application/${a.app_id}/`))}
];
