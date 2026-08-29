export class StatuspageError extends Error{constructor(message,{status,retryAfter}={}){super(message);this.name='StatuspageError';this.status=status;this.retryAfter=retryAfter;}}
const retryable=new Set([420,429,502,503,504]);const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export class StatuspageClient{
 constructor(config,fetchImpl=globalThis.fetch){this.config=config;this.fetch=fetchImpl;}
 esc(v){return encodeURIComponent(v);}
 async request(method,path,{query,body,signal,retrySafe=true}={}){const url=new URL(`${this.config.baseUrl}${path}`);for(const [k,v] of Object.entries(query||{}))if(v!==undefined&&v!==null&&v!=='')url.searchParams.set(k,String(v));let attempt=0;while(true){const timeout=AbortSignal.timeout(this.config.timeoutMs);const combined=signal?AbortSignal.any([signal,timeout]):timeout;let res;try{res=await this.fetch(url,{method,headers:{Authorization:`OAuth ${this.config.apiToken}`,Accept:'application/json',...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:combined});}catch(e){if(!retrySafe||attempt>=this.config.maxRetries||combined.aborted)throw e;await sleep(Math.min(1000*2**attempt,8000));attempt++;continue;}const text=await res.text();let data=null;if(text){try{data=JSON.parse(text);}catch{data={raw:text};}}if(res.ok)return data;const retryAfter=res.headers.get('retry-after')||undefined;if(retrySafe&&retryable.has(res.status)&&attempt<this.config.maxRetries){const delay=retryAfter&&/^\d+$/.test(retryAfter)?Math.min(Number(retryAfter)*1000,10000):Math.min(1000*2**attempt,8000);await sleep(delay);attempt++;continue;}throw new StatuspageError(data?.error||data?.message||`Statuspage request failed with HTTP ${res.status}`,{status:res.status,retryAfter});}}
 page(a,s){return this.request('GET',`/pages/${this.esc(a.page_id)}`,{signal:s});}
 components(a,s){return this.request('GET',`/pages/${this.esc(a.page_id)}/components`,{query:{page:a.page,per_page:a.per_page},signal:s});}
 component(a,s){return this.request('GET',`/pages/${this.esc(a.page_id)}/components/${this.esc(a.component_id)}`,{signal:s});}
 updateComponent(a,s){return this.request('PUT',`/pages/${this.esc(a.page_id)}/components/${this.esc(a.component_id)}`,{body:{component:a.component},signal:s,retrySafe:false});}
 incidents(a,s){return this.request('GET',`/pages/${this.esc(a.page_id)}/incidents`,{query:{q:a.q,limit:a.limit,page:a.page},signal:s});}
 incident(a,s){return this.request('GET',`/pages/${this.esc(a.page_id)}/incidents/${this.esc(a.incident_id)}`,{signal:s});}
 createIncident(a,s){return this.request('POST',`/pages/${this.esc(a.page_id)}/incidents`,{body:{incident:a.incident},signal:s,retrySafe:false});}
 updateIncident(a,s){return this.request('PATCH',`/pages/${this.esc(a.page_id)}/incidents/${this.esc(a.incident_id)}`,{body:{incident:a.incident},signal:s,retrySafe:false});}
 deleteIncident(a,s){return this.request('DELETE',`/pages/${this.esc(a.page_id)}/incidents/${this.esc(a.incident_id)}`,{signal:s,retrySafe:false});}
}
