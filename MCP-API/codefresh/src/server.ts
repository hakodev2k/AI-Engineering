import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

const BASE = process.env.CODEFRESH_API_BASE ?? 'https://g.codefresh.io/api';
const TOKEN = process.env.CODEFRESH_API_KEY;
const TIMEOUT = Number(process.env.CODEFRESH_TIMEOUT_MS ?? '15000');
const APPROVE_WRITES = process.env.CODEFRESH_APPROVE_WRITES === 'true';
if (!TOKEN) throw new Error('CODEFRESH_API_KEY is required');
if (new URL(BASE).protocol !== 'https:') throw new Error('CODEFRESH_API_BASE must use HTTPS');

export class ProviderError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message);} }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));

export async function request(path:string, init:RequestInit={}, fetcher:typeof fetch=fetch):Promise<any>{
  if (!path.startsWith('/')) throw new Error('relative API path required');
  const url=new URL(path, BASE.endsWith('/')?BASE:BASE+'/');
  if (url.origin!==new URL(BASE).origin) throw new Error('cross-origin request blocked');
  for(let attempt=0;attempt<3;attempt++){
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),TIMEOUT);
    try{
      const res=await fetcher(url,{...init,signal:controller.signal,headers:{Accept:'application/json',Authorization:TOKEN!,'X-Pagination-Session-Id':randomUUID(),...(init.headers??{})}});
      const text=await res.text(); let body:any; try{body=text?JSON.parse(text):null}catch{body={text};}
      if(res.ok) return body;
      const retryAfter=Number(res.headers.get('retry-after')??'0');
      if((res.status===429||res.status>=500)&&attempt<2){await sleep(retryAfter?retryAfter*1000:250*2**attempt);continue;}
      throw new ProviderError(res.status,`Codefresh API ${res.status}`,retryAfter||undefined);
    } finally {clearTimeout(timer);}
  }
}

const id=z.string().min(1).max(200).regex(/^[A-Za-z0-9._\/-]+$/);
const page=z.number().int().min(-1000).max(1000).default(1);
const limit=z.number().int().min(1).max(100).default(25);
const output=(v:any)=>({content:[{type:'text' as const,text:JSON.stringify({source:'codefresh',untrusted:true,data:v})}]});
const approve=()=>{if(!APPROVE_WRITES) throw new Error('Explicit approval required: set CODEFRESH_APPROVE_WRITES=true for this execution');};

export function createServer(){
 const s=new McpServer({name:'codefresh-connector',version:'1.0.0'});
 s.tool('codefresh.pipeline.list','READ: list accessible pipelines',{limit,page},async({limit,page})=>output(await request(`/pipelines?limit=${limit}&page=${page}`)));
 s.tool('codefresh.pipeline.get','READ: get pipeline metadata/spec',{pipelineId:id},async({pipelineId})=>output(await request(`/pipelines/${encodeURIComponent(pipelineId)}`)));
 s.tool('codefresh.build.list','READ: list builds; Codefresh uses cursor-backed paging',{limit,page},async({limit,page})=>output(await request(`/workflow?limit=${limit}&page=${page}`)));
 s.tool('codefresh.build.get','READ: get build status and metadata',{buildId:id},async({buildId})=>output(await request(`/builds/${encodeURIComponent(buildId)}`)));
 s.tool('codefresh.build.context','READ: get build/step context revision',{buildId:id},async({buildId})=>output(await request(`/workflow/${encodeURIComponent(buildId)}/context-revision`)));
 s.tool('codefresh.build.logs','READ: resolve completed-build progress/log metadata',{progressId:id},async({progressId})=>output(await request(`/progress/${encodeURIComponent(progressId)}`)));
 s.tool('codefresh.pipeline.run','HIGH_RISK: trigger a pipeline build; explicit approval required',{serviceId:id,branch:z.string().min(1).max(255),repoOwner:z.string().min(1).max(200),repoName:z.string().min(1).max(200),variables:z.record(z.string().max(4000)).optional()},async(v)=>{approve();return output(await request(`/builds/${encodeURIComponent(v.serviceId)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...v,type:'build'})}));});
 return s;
}
if(process.env.NODE_ENV!=='test'){const s=createServer();await s.connect(new StdioServerTransport());}
