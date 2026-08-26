import { z } from 'zod';
import type { FastlyClient } from './client.js';
import type { Config } from './config.js';
import { assertApproval } from './policy.js';

const Id=z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const Version=z.coerce.number().int().positive();
const Domain=z.string().min(1).max(253).regex(/^[A-Za-z0-9.-]+$/);
const Key=z.string().min(1).max(1024);
const Approval=z.string().regex(/^[a-f0-9]{64}$/).optional();

export type ToolDef={name:string; description:string; schema:z.ZodTypeAny; run:(input:any)=>Promise<unknown>};

export function buildTools(client: FastlyClient, cfg: Config): ToolDef[] {
  const t: ToolDef[]=[];
  const add=(name:string,description:string,schema:z.ZodTypeAny,run:(i:any)=>Promise<unknown>)=>t.push({name,description,schema,run});
  add('fastly.service.list','List Fastly services.',z.object({}),async()=>client.request('GET','/service'));
  add('fastly.service.get','Get a Fastly service.',z.object({serviceId:Id}),async i=>client.request('GET',`/service/${encodeURIComponent(i.serviceId)}/details`));
  add('fastly.version.list','List service versions.',z.object({serviceId:Id}),async i=>client.request('GET',`/service/${encodeURIComponent(i.serviceId)}/version`));
  add('fastly.version.get','Get one service version.',z.object({serviceId:Id,version:Version}),async i=>client.request('GET',`/service/${encodeURIComponent(i.serviceId)}/version/${i.version}`));
  add('fastly.version.validate','Validate a service version without activating it.',z.object({serviceId:Id,version:Version}),async i=>client.request('GET',`/service/${encodeURIComponent(i.serviceId)}/version/${i.version}/validate`));
  add('fastly.version.clone','Clone a service version into a new editable version.',z.object({serviceId:Id,version:Version,approvalId:Approval}),async i=>{const p={serviceId:i.serviceId,version:i.version};assertApproval(cfg,'fastly.version.clone',p,i.approvalId);return client.request('PUT',`/service/${encodeURIComponent(i.serviceId)}/version/${i.version}/clone`);});
  add('fastly.version.activate','Activate a service version and deploy configuration.',z.object({serviceId:Id,version:Version,approvalId:Approval}),async i=>{const p={serviceId:i.serviceId,version:i.version};assertApproval(cfg,'fastly.version.activate',p,i.approvalId);return client.request('PUT',`/service/${encodeURIComponent(i.serviceId)}/version/${i.version}/activate`);});
  add('fastly.domain.list','List domains configured on a service version.',z.object({serviceId:Id,version:Version}),async i=>client.request('GET',`/service/${encodeURIComponent(i.serviceId)}/version/${i.version}/domain`));
  add('fastly.domain.check','Check DNS configuration for a domain on a service version.',z.object({serviceId:Id,version:Version,domain:Domain}),async i=>client.request('GET',`/service/${encodeURIComponent(i.serviceId)}/version/${i.version}/domain/${encodeURIComponent(i.domain)}/check`));
  add('fastly.stats.summary','Get summary stats for a service.',z.object({serviceId:Id,from:z.string().optional(),to:z.string().optional(),by:z.string().optional()}),async i=>{const q=new URLSearchParams(); if(i.from)q.set('from',i.from); if(i.to)q.set('to',i.to); if(i.by)q.set('by',i.by); const s=q.toString(); return client.request('GET',`/service/${encodeURIComponent(i.serviceId)}/stats/summary${s?'?'+s:''}`);});
  add('fastly.cache.purge_url','Purge one cached URL; supports soft purge.',z.object({url:z.string().url().refine(v=>['http:','https:'].includes(new URL(v).protocol)),soft:z.boolean().default(true),approvalId:Approval}),async i=>{const p={url:i.url,soft:i.soft};assertApproval(cfg,'fastly.cache.purge_url',p,i.approvalId);const u=new URL(i.url);return client.request('POST',`/purge/${u.toString()}`,undefined,i.soft?{'Fastly-Soft-Purge':'1'}:{});});
  add('fastly.cache.purge_key','Purge a surrogate key from a service; supports soft purge.',z.object({serviceId:Id,surrogateKey:Key,soft:z.boolean().default(true),approvalId:Approval}),async i=>{const p={serviceId:i.serviceId,surrogateKey:i.surrogateKey,soft:i.soft};assertApproval(cfg,'fastly.cache.purge_key',p,i.approvalId);return client.request('POST',`/service/${encodeURIComponent(i.serviceId)}/purge/${encodeURIComponent(i.surrogateKey)}`,undefined,i.soft?{'Fastly-Soft-Purge':'1'}:{});});
  add('fastly.cache.purge_all','Purge all cached content for a service. This cannot be soft.',z.object({serviceId:Id,approvalId:Approval}),async i=>{const p={serviceId:i.serviceId};assertApproval(cfg,'fastly.cache.purge_all',p,i.approvalId);return client.request('POST',`/service/${encodeURIComponent(i.serviceId)}/purge_all`);});
  return t;
}
