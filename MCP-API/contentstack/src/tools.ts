import { z } from 'zod';
import type { ContentstackClient } from './client.js';
import type { Config } from './config.js';
import { enforcePolicy } from './policy.js';

const uid = z.string().min(1).max(128).regex(/^[A-Za-z0-9._-]+$/);
const locale = z.string().min(2).max(32).regex(/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/);
const approval = { approvalToken: z.string().length(64).optional() };
const page = { skip:z.number().int().min(0).max(100000).default(0), limit:z.number().int().min(1).max(100).default(50) };

export interface ToolDef {
  name:string;
  description:string;
  schema:z.ZodObject<any>;
  run:(args:any, signal?:AbortSignal)=>Promise<unknown>;
}

function cleanApproval<T extends Record<string,unknown>>(args:T):Omit<T,'approvalToken'> {
  const copy = {...args}; delete (copy as any).approvalToken; return copy as any;
}

export function buildTools(client:ContentstackClient, config:Config):ToolDef[] {
  const gate=(name:string,args:Record<string,unknown>)=>enforcePolicy(config,name,args);
  return [
    {name:'contentstack.content_type.list',description:'List content type schemas in the configured stack.',schema:z.object(page).strict(),run:a=>client.request('GET','/content_types',{query:a})},
    {name:'contentstack.content_type.get',description:'Get one content type schema.',schema:z.object({contentTypeUid:uid}).strict(),run:a=>client.request('GET',`/content_types/${encodeURIComponent(a.contentTypeUid)}`)},
    {name:'contentstack.entry.list',description:'List entries for one content type with bounded pagination.',schema:z.object({contentTypeUid:uid,locale:locale.optional(),...page}).strict(),run:a=>client.request('GET',`/content_types/${encodeURIComponent(a.contentTypeUid)}/entries`,{query:{locale:a.locale,skip:a.skip,limit:a.limit}})},
    {name:'contentstack.entry.get',description:'Get one entry.',schema:z.object({contentTypeUid:uid,entryUid:uid,locale:locale.optional(),includePublishDetails:z.boolean().default(true)}).strict(),run:a=>client.request('GET',`/content_types/${encodeURIComponent(a.contentTypeUid)}/entries/${encodeURIComponent(a.entryUid)}`,{query:{locale:a.locale,include_publish_details:a.includePublishDetails}})},
    {name:'contentstack.entry.create',description:'Create a draft entry. Human approval is required by default.',schema:z.object({contentTypeUid:uid,locale:locale.optional(),entry:z.record(z.unknown()),...approval}).strict(),run:async a=>{gate('contentstack.entry.create',a);return client.request('POST',`/content_types/${encodeURIComponent(a.contentTypeUid)}/entries`,{query:{locale:a.locale},body:{entry:a.entry},retryable:false});}},
    {name:'contentstack.entry.update',description:'Update an existing draft entry.',schema:z.object({contentTypeUid:uid,entryUid:uid,locale:locale.optional(),entry:z.record(z.unknown()),...approval}).strict(),run:async a=>{gate('contentstack.entry.update',a);return client.request('PUT',`/content_types/${encodeURIComponent(a.contentTypeUid)}/entries/${encodeURIComponent(a.entryUid)}`,{query:{locale:a.locale},body:{entry:a.entry},retryable:false});}},
    {name:'contentstack.entry.publish',description:'Publish an entry to explicit environments/locales. This makes content externally available.',schema:z.object({contentTypeUid:uid,entryUid:uid,environments:z.array(uid).min(1).max(10),locales:z.array(locale).min(1).max(50),...approval}).strict(),run:async a=>{gate('contentstack.entry.publish',a);return client.request('POST',`/content_types/${encodeURIComponent(a.contentTypeUid)}/entries/${encodeURIComponent(a.entryUid)}/publish`,{body:{entry:{environments:a.environments,locales:a.locales}},retryable:false});}},
    {name:'contentstack.entry.unpublish',description:'Unpublish an entry from explicit environments/locales.',schema:z.object({contentTypeUid:uid,entryUid:uid,environments:z.array(uid).min(1).max(10),locales:z.array(locale).min(1).max(50),...approval}).strict(),run:async a=>{gate('contentstack.entry.unpublish',a);return client.request('POST',`/content_types/${encodeURIComponent(a.contentTypeUid)}/entries/${encodeURIComponent(a.entryUid)}/unpublish`,{body:{entry:{environments:a.environments,locales:a.locales}},retryable:false});}},
    {name:'contentstack.entry.delete',description:'Delete an entry. Disabled by default and requires exact-payload approval.',schema:z.object({contentTypeUid:uid,entryUid:uid,locale:locale.optional(),confirmEntryUid:uid,...approval}).strict().refine(a=>a.entryUid===a.confirmEntryUid,{message:'confirmEntryUid must exactly match entryUid'}),run:async a=>{gate('contentstack.entry.delete',a);return client.request('DELETE',`/content_types/${encodeURIComponent(a.contentTypeUid)}/entries/${encodeURIComponent(a.entryUid)}`,{query:{locale:a.locale},retryable:false});}},
    {name:'contentstack.asset.list',description:'List stack assets with bounded pagination.',schema:z.object({...page,includeFolders:z.boolean().default(false)}).strict(),run:a=>client.request('GET','/assets',{query:{skip:a.skip,limit:a.limit,include_folders:a.includeFolders}})},
    {name:'contentstack.asset.get',description:'Get one asset and optional publish details.',schema:z.object({assetUid:uid,includePublishDetails:z.boolean().default(true)}).strict(),run:a=>client.request('GET',`/assets/${encodeURIComponent(a.assetUid)}`,{query:{include_publish_details:a.includePublishDetails}})},
    {name:'contentstack.environment.list',description:'List publishing environments.',schema:z.object(page).strict(),run:a=>client.request('GET','/environments',{query:a})},
    {name:'contentstack.workflow.list',description:'List workflows configured for the stack.',schema:z.object(page).strict(),run:a=>client.request('GET','/workflows',{query:a})}
  ];
}
