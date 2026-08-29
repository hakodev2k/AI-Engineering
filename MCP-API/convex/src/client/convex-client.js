export class ConvexApiError extends Error { constructor(message,{status,code,retryAfter}={}){ super(message); this.name='ConvexApiError'; this.status=status; this.code=code; this.retryAfter=retryAfter; } }
const RETRYABLE=new Set([429,502,503,504]);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export class ConvexClient {
  constructor(config, fetchImpl=globalThis.fetch){ this.config=config; this.fetch=fetchImpl; }
  async request(method,path,{query,body,signal,retrySafe=true}={}) { const url=new URL(`${this.config.baseUrl}${path}`); for(const [k,v] of Object.entries(query||{})) if(v!==undefined&&v!==null&&v!=='') url.searchParams.set(k,String(v)); let attempt=0; while(true){ const timeout=AbortSignal.timeout(this.config.timeoutMs); const combined=signal?AbortSignal.any([signal,timeout]):timeout; let res; try { res=await this.fetch(url,{method,headers:{Authorization:`Bearer ${this.config.token}`,Accept:'application/json',...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:combined}); } catch(e){ if(!retrySafe||attempt>=this.config.maxRetries||combined.aborted) throw e; await sleep(Math.min(250*2**attempt,4000)); attempt++; continue; } const text=await res.text(); let data=null; if(text){ try{data=JSON.parse(text);}catch{data={raw:text};} } if(res.ok) return data; const retryAfter=res.headers.get('retry-after')||undefined; if(retrySafe&&RETRYABLE.has(res.status)&&attempt<this.config.maxRetries){ const delay=retryAfter&&/^\d+$/.test(retryAfter)?Math.min(Number(retryAfter)*1000,10000):Math.min(250*2**attempt,4000); await sleep(delay); attempt++; continue; } throw new ConvexApiError(data?.message||data?.error||`Convex API HTTP ${res.status}`,{status:res.status,code:data?.code,retryAfter}); } }
  e(v){ return encodeURIComponent(String(v)); }
  listProjects(a,s){ return this.request('GET',`/teams/${this.e(a.teamId)}/projects`,{query:{limit:a.limit,cursor:a.cursor},signal:s}); }
  getProject(a,s){ return this.request('GET',`/teams/${this.e(a.team)}/projects/${this.e(a.projectSlug)}`,{signal:s}); }
  listDeployments(a,s){ return this.request('GET',`/projects/${this.e(a.projectId)}/list_deployments`,{signal:s}); }
  getDeployment(a,s){ return this.request('GET',`/projects/${this.e(a.projectId)}/deployment`,{query:{deploymentId:a.deploymentId,deploymentRef:a.deploymentRef,deploymentType:a.deploymentType},signal:s}); }
  teamDeployments(a,s){ return this.request('GET',`/teams/${this.e(a.teamId)}/list_deployments`,{query:{limit:a.limit,cursor:a.cursor},signal:s}); }
  regions(a,s){ return this.request('GET',`/teams/${this.e(a.teamId)}/list_deployment_regions`,{signal:s}); }
  classes(a,s){ return this.request('GET',`/teams/${this.e(a.teamId)}/list_deployment_classes`,{signal:s}); }
  members(a,s){ return this.request('GET',`/teams/${this.e(a.teamId)}/list_members`,{signal:s}); }
  domains(a,s){ return this.request('GET',`/deployments/${this.e(a.deploymentName)}/custom_domains`,{signal:s}); }
  deleteProject(a,s){ return this.request('POST',`/projects/${this.e(a.projectId)}/delete`,{signal:s,retrySafe:false}); }
  deleteDeployment(a,s){ return this.request('POST',`/deployments/${this.e(a.deploymentName)}/delete`,{signal:s,retrySafe:false}); }
}
