import { z } from 'zod';
import { MetabaseClient } from './client.js';
import { enforce, type PolicyContext, type Risk } from './policy.js';
import type { Config } from './config.js';

export type ToolDef = {
  name:string; description:string; risk:Risk; approval:boolean; schema:z.ZodTypeAny;
  run:(input:any, ctx:PolicyContext, signal?:AbortSignal)=>Promise<unknown>;
};

const Id=z.number().int().positive();
const OptionalId=z.number().int().positive().nullable().optional();
const Name=z.string().trim().min(1).max(254);
const Description=z.string().max(20000).nullable().optional();

export function createTools(client:MetabaseClient,cfg:Config):ToolDef[]{
  const read=(name:string,description:string,schema:z.ZodTypeAny,fn:(i:any,s?:AbortSignal)=>Promise<unknown>):ToolDef=>({name,description,risk:'READ',approval:false,schema,run:async(i,c,s)=>{enforce('READ',c,cfg.METABASE_REQUIRE_WRITE_APPROVAL);return fn(schema.parse(i),s);}});
  const write=(name:string,description:string,schema:z.ZodTypeAny,fn:(i:any,s?:AbortSignal)=>Promise<unknown>):ToolDef=>({name,description,risk:'WRITE',approval:true,schema,run:async(i,c,s)=>{enforce('WRITE',c,cfg.METABASE_REQUIRE_WRITE_APPROVAL);return fn(schema.parse(i),s);}});
  return [
    read('metabase.content.search','Search Metabase questions, dashboards and collections.',z.object({query:z.string().trim().min(1).max(500),limit:z.number().int().min(1).max(100).default(25)}).strict(),async(i,s)=>client.request('GET',`/api/search?q=${encodeURIComponent(i.query)}&limit=${i.limit}`,undefined,s)),
    read('metabase.collection.tree','List the visible collection tree.',z.object({}).strict(),async(_,s)=>client.request('GET','/api/collection/tree?exclude-archived=true&exclude-other-user-collections=true',undefined,s)),
    read('metabase.collection.get','Read one collection.',z.object({collection_id:Id}).strict(),async(i,s)=>client.request('GET',`/api/collection/${i.collection_id}`,undefined,s)),
    read('metabase.collection.items','List items in a collection with bounded pagination.',z.object({collection_id:Id,limit:z.number().int().min(1).max(100).default(50),offset:z.number().int().min(0).default(0),model:z.enum(['card','dashboard']).optional()}).strict(),async(i,s)=>{const q=new URLSearchParams({limit:String(i.limit),offset:String(i.offset)});if(i.model)q.set('models',i.model);return client.request('GET',`/api/collection/${i.collection_id}/items?${q}`,undefined,s);}),
    read('metabase.question.get','Read a saved question/card definition.',z.object({card_id:Id}).strict(),async(i,s)=>client.request('GET',`/api/card/${i.card_id}`,undefined,s)),
    read('metabase.question.run','Execute a saved question and return its result.',z.object({card_id:Id,parameters:z.array(z.object({type:z.string().min(1).max(80),target:z.array(z.unknown()).min(1),value:z.unknown()}).strict()).max(50).default([])}).strict(),async(i,s)=>client.request('POST',`/api/card/${i.card_id}/query`,{parameters:i.parameters},s)),
    read('metabase.dashboard.get','Read one dashboard and its card metadata.',z.object({dashboard_id:Id}).strict(),async(i,s)=>client.request('GET',`/api/dashboard/${i.dashboard_id}`,undefined,s)),
    read('metabase.agent.search','Use the versioned Agent API to find tables and metrics by natural-language search.',z.object({query:z.string().trim().min(1).max(1000)}).strict(),async(i,s)=>client.request('POST','/api/agent/v1/search',{query:i.query},s)),
    write('metabase.collection.create','Create a collection.',z.object({name:Name,description:Description,parent_id:OptionalId}).strict(),async(i,s)=>client.request('POST','/api/collection',{name:i.name,description:i.description??null,parent_id:i.parent_id??null},s)),
    write('metabase.dashboard.create','Create an empty dashboard.',z.object({name:Name,description:Description,collection_id:OptionalId}).strict(),async(i,s)=>client.request('POST','/api/dashboard',{name:i.name,description:i.description??null,collection_id:i.collection_id??null},s)),
    write('metabase.question.create_native','Create a saved native SQL question. The SQL is sent only to the configured Metabase instance.',z.object({name:Name,description:Description,collection_id:OptionalId,database_id:Id,sql:z.string().trim().min(1).max(100000)}).strict(),async(i,s)=>client.request('POST','/api/card',{name:i.name,description:i.description??null,collection_id:i.collection_id??null,type:'question',display:'table',dataset_query:{type:'native',database:i.database_id,native:{query:i.sql,'template-tags':{}}}},s)),
    write('metabase.question.update_metadata','Update question name, description, or collection without accepting arbitrary API fields.',z.object({card_id:Id,name:Name.optional(),description:Description,collection_id:OptionalId}).strict().refine(v=>v.name!==undefined||v.description!==undefined||v.collection_id!==undefined,{message:'at least one field must be supplied'}),async(i,s)=>{const {card_id,...body}=i;return client.request('PUT',`/api/card/${card_id}`,body,s);})
  ];
}
