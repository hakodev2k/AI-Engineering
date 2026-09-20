import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class SemaphoreError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
export class SemaphoreClient {
  private base:string; private token:string; private timeout:number; private retries:number;
  constructor(env:NodeJS.ProcessEnv=process.env){
    const raw=env.SEMAPHORE_BASE_URL, token=env.SEMAPHORE_API_TOKEN;
    if(!raw||!token) throw new Error('SEMAPHORE_BASE_URL and SEMAPHORE_API_TOKEN are required');
    const u=new URL(raw); if(u.protocol!=='https:') throw new Error('SEMAPHORE_BASE_URL must use HTTPS');
    this.base=u.origin+'/api/v1alpha'; this.token=token; this.timeout=Number(env.SEMAPHORE_TIMEOUT_MS||15000); this.retries=Math.min(3,Math.max(0,Number(env.SEMAPHORE_MAX_RETRIES||2)));
  }
  async request(path:string, init:RequestInit={}, retryable=true):Promise<any>{
    if(!path.startsWith('/')) throw new Error('relative API path required');
    for(let a=0;;a++){
      const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),this.timeout);
      try{
        const r=await fetch(this.base+path,{...init,signal:ctl.signal,headers:{'Authorization':`Token ${this.token}`,'User-Agent':'SemaphoreCI v2.0 Client','Accept':'application/json','Content-Type':'application/json',...(init.headers||{})}});
        const retryAfter=Number(r.headers.get('retry-after')||0)||undefined;
        if(r.ok){const text=await r.text(); return text?JSON.parse(text):{ok:true};}
        const body=(await r.text()).slice(0,2000); const err=new SemaphoreError(r.status,`Semaphore API ${r.status}: ${body}`,retryAfter);
        if(!retryable||![429,502,503,504].includes(r.status)||a>=this.retries) throw err;
        await new Promise(x=>setTimeout(x,retryAfter?retryAfter*1000:Math.min(4000,250*2**a)));
      } catch(e:any){ if(e?.name==='AbortError') throw new SemaphoreError(408,'Semaphore request timed out'); throw e; } finally {clearTimeout(timer)}
    }
  }
}
const id=z.string().uuid(); const project=z.string().min(1).max(200); const ref=z.string().regex(/^refs\/(heads|tags|pull)\//).max(500);
export function assertApproval(risk:Risk, approved:boolean, env:NodeJS.ProcessEnv=process.env){if(risk==='DESTRUCTIVE')throw new Error('Destructive tools are disabled'); if(risk==='HIGH_RISK'&&!approved)throw new Error('Explicit human approval required'); if(risk==='WRITE'&&env.SEMAPHORE_APPROVE_WRITES==='true'&&!approved)throw new Error('Write approval required');}
export function buildServer(client=new SemaphoreClient()){
 const s=new McpServer({name:'semaphore-ci',version:'1.0.0'}); const out=(v:any)=>({content:[{type:'text' as const,text:JSON.stringify({untrusted_provider_data:v})}]});
 const reg=(name:string,description:string,schema:any,risk:Risk,fn:(a:any)=>Promise<any>)=>s.tool(name,description,schema,async(a:any)=>{assertApproval(risk,Boolean(a.approved));return out(await fn(a));});
 reg('semaphore.project.list','List visible projects.',{page:z.number().int().min(1).max(1000).optional()},'READ',a=>client.request(`/projects${a.page?`?page=${a.page}`:''}`));
 reg('semaphore.project.get','Get project metadata.',{project_id:id},'READ',a=>client.request(`/projects/${a.project_id}`));
 reg('semaphore.workflow.list','List project workflows.',{project_id:id,branch_name:z.string().max(255).optional()},'READ',a=>client.request(`/plumber-workflows?project_id=${a.project_id}${a.branch_name?`&branch_name=${encodeURIComponent(a.branch_name)}`:''}`));
 reg('semaphore.workflow.get','Get workflow metadata.',{workflow_id:id},'READ',a=>client.request(`/plumber-workflows/${a.workflow_id}`));
 reg('semaphore.pipeline.list','List pipelines for a project or workflow.',{project_id:id.optional(),workflow_id:id.optional()},'READ',a=>{if(!a.project_id&&!a.workflow_id)throw new Error('project_id or workflow_id required');return client.request(`/pipelines?${a.project_id?`project_id=${a.project_id}`:`wf_id=${a.workflow_id}`}`)});
 reg('semaphore.pipeline.get','Get pipeline status and optional job detail.',{pipeline_id:id,detailed:z.boolean().optional()},'READ',a=>client.request(`/pipelines/${a.pipeline_id}${a.detailed?'?detailed=true':''}`));
 reg('semaphore.pipeline.validate_yaml','Validate Semaphore pipeline YAML without running it.',{yaml_definition:z.string().min(1).max(200000)},'READ',a=>client.request('/yaml',{method:'POST',body:JSON.stringify({yaml_definition:a.yaml_definition})}));
 reg('semaphore.workflow.run','Start a workflow. This executes CI/CD code.',{project_id:id,reference:ref,commit_sha:z.string().regex(/^[0-9a-f]{40}$/i).optional(),pipeline_file:z.string().regex(/^\.semaphore\/[A-Za-z0-9._/-]+\.ya?ml$/).optional(),approved:z.literal(true)},'HIGH_RISK',a=>client.request('/plumber-workflows',{method:'POST',body:JSON.stringify({project_id:a.project_id,reference:a.reference,commit_sha:a.commit_sha,pipeline_file:a.pipeline_file})},false));
 reg('semaphore.pipeline.stop','Stop a running pipeline.',{pipeline_id:id,approved:z.literal(true)},'HIGH_RISK',a=>client.request(`/pipelines/${a.pipeline_id}`,{method:'PATCH',body:JSON.stringify({terminate_request:true})},false));
 reg('semaphore.task.run','Run a configured Semaphore task.',{task_id:id,branch:z.string().min(1).max(255).optional(),pipeline_file:z.string().regex(/^\.semaphore\/[A-Za-z0-9._/-]+\.ya?ml$/).optional(),approved:z.literal(true)},'HIGH_RISK',a=>client.request(`/tasks/${a.task_id}/run_now`,{method:'POST',body:JSON.stringify({branch:a.branch,pipeline_file:a.pipeline_file})},false));
 return s;
}
if(process.env.NODE_ENV!=='test'){const s=buildServer();await s.connect(new StdioServerTransport());}
