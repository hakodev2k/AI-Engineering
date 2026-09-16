import { z } from 'zod';
import { LogSnagClient } from './client.js';

const slug=z.string().min(1).max(64).regex(/^[a-z0-9-]+$/); const text=z.string().min(1).max(512); const emoji=z.string().max(32).optional();
const scalar=z.union([z.string().max(512),z.number().finite(),z.boolean()]); const kv=z.record(z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),scalar).refine(v=>Object.keys(v).length<=50,'maximum 50 properties');
export const eventSchema=z.object({project:slug.optional(),channel:slug,event:text,description:z.string().max(4000).optional(),icon:emoji,tags:kv.optional(),parser:z.enum(['text','markdown']).optional(),user_id:z.string().min(1).max(256).optional(),timestamp:z.number().int().positive().optional(),approval:z.boolean().optional()}).strict();
export const identifySchema=z.object({project:slug.optional(),user_id:z.string().min(1).max(256),properties:kv,approval:z.boolean().optional()}).strict();
export const insightSchema=z.object({project:slug.optional(),title:text,value:z.union([z.string().max(512),z.number().finite()]),icon:emoji,approval:z.boolean().optional()}).strict();
export const mutateSchema=z.object({project:slug.optional(),title:text,value:z.number().finite().positive(),icon:emoji,approval:z.boolean().optional()}).strict();
export type Policy={defaultProject?:string;requireWriteApproval:boolean;allowNotifications:boolean};
function project(p:string|undefined, policy:Policy){const v=p??policy.defaultProject;if(!v)throw new Error('project is required when LOGSNAG_DEFAULT_PROJECT is not set');return slug.parse(v)}
function approve(a:boolean|undefined,policy:Policy,high=false){if(high&&!policy.allowNotifications)throw new Error('notification publishing is disabled by LOGSNAG_ALLOW_NOTIFICATIONS');if((policy.requireWriteApproval||high)&&a!==true)throw new Error('explicit approval=true is required');}
export function handlers(client:LogSnagClient,policy:Policy){return {
  eventPublish:async(raw:unknown)=>{const x=eventSchema.parse(raw);approve(x.approval,policy);const {approval,...rest}=x;return client.post('/v1/log',{...rest,project:project(x.project,policy),notify:false});},
  eventNotify:async(raw:unknown)=>{const x=eventSchema.parse(raw);approve(x.approval,policy,true);const {approval,...rest}=x;return client.post('/v1/log',{...rest,project:project(x.project,policy),notify:true});},
  identify:async(raw:unknown)=>{const x=identifySchema.parse(raw);approve(x.approval,policy);const {approval,...rest}=x;return client.post('/v1/identify',{...rest,project:project(x.project,policy)});},
  insightSet:async(raw:unknown)=>{const x=insightSchema.parse(raw);approve(x.approval,policy);const {approval,...rest}=x;return client.post('/v1/insight',{...rest,project:project(x.project,policy)});},
  insightIncrement:async(raw:unknown)=>{const x=mutateSchema.parse(raw);approve(x.approval,policy);return client.post('/v1/insight',{project:project(x.project,policy),title:x.title,value:{$inc:x.value},icon:x.icon},'PATCH');},
  insightDecrement:async(raw:unknown)=>{const x=mutateSchema.parse(raw);approve(x.approval,policy);return client.post('/v1/insight',{project:project(x.project,policy),title:x.title,value:{$inc:-x.value},icon:x.icon},'PATCH');}
};}
