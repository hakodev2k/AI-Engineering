export class AirbyteError extends Error { constructor(message,{status,code,retryAfter}={}) { super(message); this.name='AirbyteError'; this.status=status; this.code=code; this.retryAfter=retryAfter; } }
const RETRYABLE = new Set([429,502,503,504]); const sleep = ms => new Promise(r=>setTimeout(r,ms));
export class AirbyteClient {
  constructor(config, fetchImpl = globalThis.fetch) { this.config=config; this.fetch=fetchImpl; this.cachedToken=null; this.tokenExpiresAt=0; }
  async token(signal) {
    if (this.config.authMode === 'none') return null;
    if (this.cachedToken && Date.now() < this.tokenExpiresAt) return this.cachedToken;
    const res = await this.fetch(this.config.tokenUrl,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({client_id:this.config.clientId,client_secret:this.config.clientSecret,'grant-type':'client_credentials'}),signal});
    const text=await res.text(); let data={}; try { data=text?JSON.parse(text):{}; } catch { data={raw:text}; }
    if (!res.ok || !data.access_token) throw new AirbyteError(data.message||data.error||`Airbyte token request failed with HTTP ${res.status}`,{status:res.status,code:data.code,retryAfter:res.headers.get('retry-after')||undefined});
    const ttl = Math.max(30, Math.min(Number(data.expires_in)||180, 180)); this.cachedToken=data.access_token; this.tokenExpiresAt=Date.now()+(ttl-20)*1000; return this.cachedToken;
  }
  async request(method,path,{query,body,signal,retrySafe=true}={}) {
    const url=new URL(`${this.config.apiUrl.replace(/\/$/,'')}/${path.replace(/^\//,'')}`);
    for (const [k,v] of Object.entries(query||{})) { if (v===undefined||v===null||v==='') continue; url.searchParams.set(k,Array.isArray(v)?v.join(','):String(v)); }
    let attempt=0;
    while (true) {
      const timeout=AbortSignal.timeout(this.config.timeoutMs); const combined=signal?AbortSignal.any([signal,timeout]):timeout; let res;
      try {
        const tok=await this.token(combined); res=await this.fetch(url,{method,headers:{Accept:'application/json',...(tok?{Authorization:`Bearer ${tok}`}:{}) ,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:combined});
      } catch (e) { if (!retrySafe || attempt>=this.config.maxRetries || combined.aborted || e instanceof AirbyteError) throw e; await sleep(Math.min(250*2**attempt,4000)); attempt++; continue; }
      if (res.status===401 && this.config.authMode==='client_credentials' && attempt===0) { this.cachedToken=null; this.tokenExpiresAt=0; attempt++; continue; }
      const text=await res.text(); let data=null; if(text){try{data=JSON.parse(text);}catch{data={raw:text};}}
      if(res.ok) return data;
      const retryAfter=res.headers.get('retry-after')||undefined;
      if(retrySafe && RETRYABLE.has(res.status) && attempt<this.config.maxRetries){ const ms=retryAfter&&/^\d+$/.test(retryAfter)?Math.min(Number(retryAfter)*1000,10000):Math.min(250*2**attempt,4000); await sleep(ms); attempt++; continue; }
      throw new AirbyteError(data?.message||data?.error||`Airbyte request failed with HTTP ${res.status}`,{status:res.status,code:data?.code,retryAfter});
    }
  }
  listWorkspaces(a,s){return this.request('GET','workspaces',{query:a,signal:s});} listSources(a,s){return this.request('GET','sources',{query:a,signal:s});} getSource(a,s){return this.request('GET',`sources/${a.sourceId}`,{signal:s});}
  listDestinations(a,s){return this.request('GET','destinations',{query:a,signal:s});} getDestination(a,s){return this.request('GET',`destinations/${a.destinationId}`,{signal:s});}
  listConnections(a,s){return this.request('GET','connections',{query:a,signal:s});} getConnection(a,s){return this.request('GET',`connections/${a.connectionId}`,{signal:s});}
  listStreams(a,s){return this.request('GET','streams',{query:a,signal:s});} listJobs(a,s){return this.request('GET','jobs',{query:a,signal:s});} getJob(a,s){return this.request('GET',`jobs/${a.jobId}`,{signal:s});}
  createJob(connectionId,jobType,s){return this.request('POST','jobs',{body:{connectionId,jobType},signal:s,retrySafe:false});} cancelJob(jobId,s){return this.request('DELETE',`jobs/${jobId}`,{signal:s,retrySafe:false});}
}
