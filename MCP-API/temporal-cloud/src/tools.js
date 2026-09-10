import { z } from 'zod';
import { Risk, enforcePolicy } from './policy.js';

const id = z.string().min(1).max(256).regex(/^[A-Za-z0-9._:@-]+$/);
const page = z.object({pageSize:z.number().int().min(1).max(1000).optional(),pageToken:z.string().max(4096).optional()}).strict();
const approved = {approvalToken:z.string().length(64)};

export const tools = [
  ['temporal_cloud.account.get','Get Temporal Cloud account metadata',Risk.READ,z.object({}).strict(), c=>c.request('GET','/cloud/account')],
  ['temporal_cloud.identity.get','Get the current authenticated Temporal Cloud identity',Risk.READ,z.object({}).strict(), c=>c.request('GET','/cloud/current-identity')],
  ['temporal_cloud.namespace.list','List namespaces with bounded pagination',Risk.READ,page.extend({name:z.string().max(255).optional(),projectId:id.optional()}).strict(), (c,a)=>c.request('GET','/cloud/namespaces',{query:a})],
  ['temporal_cloud.namespace.get','Get one namespace',Risk.READ,z.object({namespace:id}).strict(), (c,a)=>c.request('GET',`/cloud/namespaces/${encodeURIComponent(a.namespace)}`)],
  ['temporal_cloud.namespace.capacity.get','Get namespace capacity information and APS statistics',Risk.READ,z.object({namespace:id}).strict(), (c,a)=>c.request('GET',`/cloud/namespaces/${encodeURIComponent(a.namespace)}/capacity-info`)],
  ['temporal_cloud.region.list','List available Temporal Cloud regions',Risk.READ,page, (c,a)=>c.request('GET','/cloud/regions',{query:a})],
  ['temporal_cloud.region.get','Get one Temporal Cloud region',Risk.READ,z.object({region:id}).strict(), (c,a)=>c.request('GET',`/cloud/regions/${encodeURIComponent(a.region)}`)],
  ['temporal_cloud.user.list','List account users',Risk.READ,page, (c,a)=>c.request('GET','/cloud/users',{query:a})],
  ['temporal_cloud.user.get','Get one account user',Risk.READ,z.object({userId:id}).strict(), (c,a)=>c.request('GET',`/cloud/users/${encodeURIComponent(a.userId)}`)],
  ['temporal_cloud.service_account.list','List service accounts',Risk.READ,page, (c,a)=>c.request('GET','/cloud/service-accounts',{query:a})],
  ['temporal_cloud.service_account.get','Get one service account',Risk.READ,z.object({serviceAccountId:id}).strict(), (c,a)=>c.request('GET',`/cloud/service-accounts/${encodeURIComponent(a.serviceAccountId)}`)],
  ['temporal_cloud.audit_log.list','List account audit logs with bounded pagination',Risk.READ,page.extend({startTime:z.string().datetime().optional(),endTime:z.string().datetime().optional()}).strict(), (c,a)=>c.request('GET','/cloud/audit-logs',{query:a})],
  ['temporal_cloud.operation.get','Inspect a Cloud Ops asynchronous operation',Risk.READ,z.object({asyncOperationId:id}).strict(), (c,a)=>c.request('GET',`/cloud/operations/${encodeURIComponent(a.asyncOperationId)}`)],
  ['temporal_cloud.namespace.create','Create a Temporal Cloud namespace',Risk.HIGH_RISK,z.object({name:id,regions:z.array(id).min(1).max(3),retentionDays:z.number().int().min(1).max(90),description:z.string().max(1024).optional(),projectId:id.optional(),apiKeyAuth:z.boolean().default(true),...approved}).strict(), (c,a)=>c.request('POST','/cloud/namespaces',{body:{projectId:a.projectId,spec:{name:a.name,regions:a.regions,retentionDays:a.retentionDays,description:a.description,apiKeyAuth:{enabled:a.apiKeyAuth}}},retryable:false})],
  ['temporal_cloud.namespace.tags.update','Add/update/remove namespace tags',Risk.WRITE,z.object({namespace:id,tagsToUpsert:z.record(z.string().max(256)).optional(),tagsToRemove:z.array(z.string().min(1).max(128)).max(50).optional(),...approved}).strict().refine(v=>Object.keys(v.tagsToUpsert||{}).length>0||(v.tagsToRemove||[]).length>0,'At least one tag update is required'), (c,a)=>c.request('POST',`/cloud/namespaces/${encodeURIComponent(a.namespace)}/update-tags`,{body:{tagsToUpsert:a.tagsToUpsert,tagsToRemove:a.tagsToRemove},retryable:false})],
  ['temporal_cloud.namespace.delete','Permanently delete a namespace and all its data',Risk.DESTRUCTIVE,z.object({namespace:id,resourceVersion:z.string().min(1).max(256),confirmation:z.string().min(1).max(300),...approved}).strict().refine(v=>v.confirmation===`DELETE TEMPORAL NAMESPACE ${v.namespace}`,'confirmation must exactly match DELETE TEMPORAL NAMESPACE <namespace>'), (c,a)=>c.request('DELETE',`/cloud/namespaces/${encodeURIComponent(a.namespace)}`,{query:{resourceVersion:a.resourceVersion},retryable:false})]
];

export const toolDefinitions = tools.map(([name,description,risk,schema])=>({
  name, description:`${description}. Risk: ${risk}.`, inputSchema:zodToJsonSchema(schema)
}));

function zodToJsonSchema(schema){
  let current=schema;
  while(current?._def?.typeName==='ZodEffects') current=current._def.schema;
  const def=current?._def;
  if(def?.typeName!=='ZodObject') return {type:'object',additionalProperties:false};
  const shape=typeof def.shape==='function'?def.shape():def.shape;
  const properties={}; const required=[];
  for(const [k,v0] of Object.entries(shape||{})){
    let v=v0, optional=false, d=v?._def;
    while(d && ['ZodOptional','ZodDefault'].includes(d.typeName)){optional=true;v=d.innerType;d=v?._def;}
    const t=d?.typeName;
    if(t==='ZodNumber') properties[k]={type:'number'};
    else if(t==='ZodBoolean') properties[k]={type:'boolean'};
    else if(t==='ZodArray') properties[k]={type:'array',items:{type:'string'}};
    else if(t==='ZodRecord') properties[k]={type:'object',additionalProperties:{type:'string'}};
    else properties[k]={type:'string'};
    if(!optional) required.push(k);
  }
  return {type:'object',properties,required,additionalProperties:false};
}

export async function executeTool(config, client, name, rawArgs={}){
  const tool=tools.find(t=>t[0]===name); if(!tool) throw new Error('Unknown tool');
  const [, , risk, schema, handler]=tool; const args=schema.parse(rawArgs);
  enforcePolicy(config,name,risk,args);
  const forwarded={...args}; delete forwarded.approvalToken; delete forwarded.confirmation;
  const data=await handler(client,forwarded);
  return {untrusted_provider_data:true,data};
}
