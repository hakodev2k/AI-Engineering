import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE = process.env.ELASTIC_CLOUD_API_BASE ?? 'https://api.elastic-cloud.com';
const KEY = process.env.ELASTIC_CLOUD_API_KEY;
const TIMEOUT = Number(process.env.ELASTIC_CLOUD_TIMEOUT_MS ?? '15000');
const WRITE = process.env.ELASTIC_CLOUD_APPROVE_WRITES === 'true';
const HIGH = process.env.ELASTIC_CLOUD_APPROVE_HIGH_RISK === 'true';
const DESTROY = process.env.ELASTIC_CLOUD_ALLOW_DESTRUCTIVE === 'true';
if (!KEY) throw new Error('ELASTIC_CLOUD_API_KEY is required');
const baseUrl = new URL(BASE);
if (baseUrl.protocol !== 'https:') throw new Error('ELASTIC_CLOUD_API_BASE must use HTTPS');

export class ElasticCloudError extends Error {
  constructor(public status:number, message:string, public retryAfter?:number, public requestId?:string){super(message);}
}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));

export async function request(path:string, init:RequestInit={}, fetcher:typeof fetch=fetch):Promise<any>{
  if(!path.startsWith('/')) throw new Error('relative API path required');
  const url=new URL(path, BASE.endsWith('/')?BASE:BASE+'/');
  if(url.origin!==baseUrl.origin) throw new Error('cross-origin request blocked');
  const method=(init.method??'GET').toUpperCase();
  const retryable=method==='GET'||method==='HEAD';
  for(let attempt=0;attempt<(retryable?3:1);attempt++){
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),TIMEOUT);
    try{
      const res=await fetcher(url,{...init,signal:controller.signal,headers:{Accept:'application/json',Authorization:`ApiKey ${KEY}`,...(init.body?{'content-type':'application/json'}:{}),...(init.headers??{})}});
      const text=await res.text(); let body:any; try{body=text?JSON.parse(text):null}catch{body={text};}
      if(res.ok) return body;
      const retryAfter=Number(res.headers.get('retry-after')??'0');
      if(retryable&&(res.status===429||res.status>=500)&&attempt<2){await sleep(retryAfter?retryAfter*1000:300*2**attempt);continue;}
      const msg=body?.errors?.[0]?.message??body?.message??`Elastic Cloud API ${res.status}`;
      throw new ElasticCloudError(res.status,msg,retryAfter||undefined,res.headers.get('x-request-id')??undefined);
    } finally {clearTimeout(timer);}
  }
}

const id=z.string().min(1).max(200).regex(/^[A-Za-z0-9._-]+$/);
const page=z.number().int().min(1).max(10000).default(1);
const size=z.number().int().min(1).max(100).default(25);
const region=z.string().min(1).max(100).regex(/^[A-Za-z0-9._-]+$/);
const output=(data:any)=>({content:[{type:'text' as const,text:JSON.stringify({source:'elastic-cloud',untrusted:true,data})}]});
const approve=(level:'write'|'high'|'destructive')=>{
 if(level==='write'&&!WRITE) throw new Error('WRITE approval required: set ELASTIC_CLOUD_APPROVE_WRITES=true for this execution');
 if(level==='high'&&!HIGH) throw new Error('HIGH_RISK approval required: set ELASTIC_CLOUD_APPROVE_HIGH_RISK=true for this execution');
 if(level==='destructive'&&!DESTROY) throw new Error('DESTRUCTIVE operation disabled: set ELASTIC_CLOUD_ALLOW_DESTRUCTIVE=true for this execution');
};
const bodySchema=z.record(z.unknown()).refine(v=>Object.keys(v).length>0,'body must not be empty');

export function createServer(){
 const s=new McpServer({name:'elastic-cloud-connector',version:'1.0.0'});
 s.tool('elastic-cloud.deployment.list','READ: list deployments',{page,size},async(v)=>output(await request(`/api/v1/deployments?page=${v.page}&size=${v.size}`)));
 s.tool('elastic-cloud.deployment.get','READ: get deployment',{deploymentId:id},async(v)=>output(await request(`/api/v1/deployments/${encodeURIComponent(v.deploymentId)}`)));
 s.tool('elastic-cloud.deployment.resource.list','READ: list deployment resources',{deploymentId:id},async(v)=>output(await request(`/api/v1/deployments/${encodeURIComponent(v.deploymentId)}/resources`)));
 s.tool('elastic-cloud.deployment.resource.get','READ: get deployment resource',{deploymentId:id,resourceKind:z.enum(['elasticsearch','kibana','apm','enterprise_search','integrations_server']),resourceId:id},async(v)=>output(await request(`/api/v1/deployments/${encodeURIComponent(v.deploymentId)}/${encodeURIComponent(v.resourceKind)}/${encodeURIComponent(v.resourceId)}`)));
 s.tool('elastic-cloud.deployment.activity.list','READ: get deployment activity',{deploymentId:id},async(v)=>output(await request(`/api/v1/deployments/${encodeURIComponent(v.deploymentId)}/elasticsearch`)));
 s.tool('elastic-cloud.region.list','READ: list available regions',{provider:z.enum(['aws','gcp','azure']).optional()},async(v)=>output(await request(`/api/v1/platform/infrastructure/regions${v.provider?`?provider=${encodeURIComponent(v.provider)}`:''}`)));
 s.tool('elastic-cloud.stack_version.list','READ: list available Elastic Stack versions',{},async()=>output(await request('/api/v1/platform/configuration/versions')));
 s.tool('elastic-cloud.traffic_filter.list','READ: list traffic filter rulesets',{regionId:region,includeAssociations:z.boolean().default(true)},async(v)=>output(await request(`/api/v1/deployments/traffic-filter/rulesets?region=${encodeURIComponent(v.regionId)}&include_associations=${v.includeAssociations}`)));
 s.tool('elastic-cloud.traffic_filter.get','READ: get traffic filter ruleset',{rulesetId:id},async(v)=>output(await request(`/api/v1/deployments/traffic-filter/rulesets/${encodeURIComponent(v.rulesetId)}`)));
 s.tool('elastic-cloud.deployment.create','WRITE: create deployment; approval required',{deployment:bodySchema},async(v)=>{approve('write');return output(await request('/api/v1/deployments',{method:'POST',body:JSON.stringify(v.deployment)}));});
 s.tool('elastic-cloud.deployment.update','HIGH_RISK: update deployment topology/configuration; explicit approval required',{deploymentId:id,plan:bodySchema},async(v)=>{approve('high');return output(await request(`/api/v1/deployments/${encodeURIComponent(v.deploymentId)}`,{method:'PUT',body:JSON.stringify(v.plan)}));});
 s.tool('elastic-cloud.deployment.shutdown','HIGH_RISK: shut down deployment; explicit approval required',{deploymentId:id,hide:z.boolean().default(false)},async(v)=>{approve('high');return output(await request(`/api/v1/deployments/${encodeURIComponent(v.deploymentId)}/_shutdown?hide=${v.hide}`,{method:'POST'}));});
 s.tool('elastic-cloud.deployment.delete','DESTRUCTIVE: permanently delete deployment; disabled by default',{deploymentId:id},async(v)=>{approve('destructive');return output(await request(`/api/v1/deployments/${encodeURIComponent(v.deploymentId)}`,{method:'DELETE'}));});
 return s;
}
if(process.env.NODE_ENV!=='test'){const s=createServer();await s.connect(new StdioServerTransport());}
