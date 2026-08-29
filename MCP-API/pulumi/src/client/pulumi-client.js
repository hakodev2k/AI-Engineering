export class PulumiError extends Error{ constructor(message,{status,code,retryAfter}={}){ super(message); this.name='PulumiError'; this.status=status; this.code=code; this.retryAfter=retryAfter; }}
const RETRYABLE=new Set([429,502,503,504]);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export class PulumiClient{
 constructor(config,fetchImpl=globalThis.fetch){ this.config=config; this.fetch=fetchImpl; }
 async request(method,path,{query,body,signal,retrySafe=true}={}){ const url=new URL(path,`${this.config.baseUrl}/`); for(const [k,v] of Object.entries(query||{})){ if(v!==undefined&&v!==null&&v!=='') url.searchParams.set(k,String(v)); } let attempt=0; while(true){ const timeout=AbortSignal.timeout(this.config.timeoutMs); const combined=signal?AbortSignal.any([signal,timeout]):timeout; let res; try{ res=await this.fetch(url,{method,headers:{Authorization:`token ${this.config.accessToken}`,Accept:'application/json',...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:combined}); }catch(e){ if(!retrySafe||attempt>=this.config.maxRetries||combined.aborted) throw e; await sleep(Math.min(250*2**attempt,4000)); attempt++; continue; } const text=await res.text(); let data=null; if(text){ try{data=JSON.parse(text);}catch{data={raw:text};} } if(res.ok) return data; const retryAfter=res.headers.get('retry-after')||undefined; if(retrySafe&&RETRYABLE.has(res.status)&&attempt<this.config.maxRetries){ const delay=retryAfter&&/^\d+$/.test(retryAfter)?Math.min(Number(retryAfter)*1000,10000):Math.min(250*2**attempt,4000); await sleep(delay); attempt++; continue; } throw new PulumiError(data?.message||data?.error||`Pulumi request failed with HTTP ${res.status}`,{status:res.status,code:data?.code,retryAfter}); }}
 esc(v){return encodeURIComponent(v);} stackPath(a){return `/api/stacks/${this.esc(a.orgName)}/${this.esc(a.projectName)}/${this.esc(a.stackName)}`;}
 getStack(a,s){return this.request('GET',this.stackPath(a),{signal:s});}
 activity(a,s){return this.request('GET',`${this.stackPath(a)}/activity`,{query:{page:a.page,pageSize:a.pageSize},signal:s});}
 resourceCount(a,s){return this.request('GET',`${this.stackPath(a)}/resources/count`,{signal:s});}
 resources(a,s){return this.request('GET',`${this.stackPath(a)}/resources/latest`,{signal:s});}
 resource(a,s){return this.request('GET',`${this.stackPath(a)}/resources/latest/${this.esc(a.urn)}`,{signal:s});}
 listDeployments(a,s){return this.request('GET',`${this.stackPath(a)}/deployments`,{query:{page:a.page,pageSize:a.pageSize,sort:a.sort,asc:a.asc},signal:s});}
 getDeployment(a,s){return this.request('GET',`${this.stackPath(a)}/deployments/${this.esc(a.deploymentId)}`,{signal:s});}
 deploymentLogs(a,s){return this.request('GET',`${this.stackPath(a)}/deployments/${this.esc(a.deploymentId)}/logs`,{query:{continuationToken:a.continuationToken,job:a.job,step:a.step,offset:a.offset,count:a.count},signal:s});}
 createDeployment(a,operation,s){ const {orgName,projectName,stackName,...rest}=a; return this.request('POST',`${this.stackPath(a)}/deployments`,{body:{operation,...rest},signal:s,retrySafe:false});}
 cancelDeployment(a,s){return this.request('POST',`${this.stackPath(a)}/deployments/${this.esc(a.deploymentId)}/cancel`,{signal:s,retrySafe:false});}
}
