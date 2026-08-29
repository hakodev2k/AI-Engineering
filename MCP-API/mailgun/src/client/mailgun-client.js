export class MailgunError extends Error{ constructor(message,{status,rateLimit,retryAfter}={}){ super(message); this.name='MailgunError'; this.status=status; this.rateLimit=rateLimit; this.retryAfter=retryAfter; } }
const RETRYABLE=new Set([429,502,503,504]); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export class MailgunClient{
  constructor(config,fetchImpl=globalThis.fetch){ this.config=config; this.fetch=fetchImpl; }
  authHeader(){ return `Basic ${Buffer.from(`api:${this.config.apiKey}`).toString('base64')}`; }
  async request(method,path,{query,body,form,signal,retrySafe=true}={}){
    const url=new URL(path,`${this.config.baseUrl}/`); for(const [k,v] of Object.entries(query||{})){ if(v!==undefined&&v!==null&&v!=='') url.searchParams.set(k,String(v)); }
    let attempt=0;
    while(true){
      const timeout=AbortSignal.timeout(this.config.timeoutMs); const combined=signal?AbortSignal.any([signal,timeout]):timeout;
      const headers={Authorization:this.authHeader(),Accept:'application/json'}; let payload;
      if(form){ const f=new FormData(); for(const [k,v] of Object.entries(form)){ if(v===undefined||v===null) continue; if(Array.isArray(v)) for(const item of v) f.append(k,String(item)); else f.append(k,String(v)); } payload=f; }
      else if(body!==undefined){ headers['Content-Type']='application/json'; payload=JSON.stringify(body); }
      try{
        const res=await this.fetch(url,{method,headers,body:payload,signal:combined}); const text=await res.text(); let data=null; if(text){ try{data=JSON.parse(text);}catch{data={raw:text};} }
        if(res.ok) return data;
        const rateLimit={limit:res.headers.get('x-ratelimit-limit')||undefined,remaining:res.headers.get('x-ratelimit-remaining')||undefined,reset:res.headers.get('x-ratelimit-reset')||undefined};
        const retryAfter=res.headers.get('retry-after')||undefined;
        if(retrySafe&&RETRYABLE.has(res.status)&&attempt<this.config.maxRetries){ const delay=retryAfter&&/^\d+$/.test(retryAfter)?Math.min(Number(retryAfter)*1000,10000):Math.min(250*2**attempt,4000); await sleep(delay); attempt++; continue; }
        throw new MailgunError(data?.message||data?.error||`Mailgun request failed with HTTP ${res.status}`,{status:res.status,rateLimit,retryAfter});
      }catch(e){ if(e instanceof MailgunError) throw e; if(!retrySafe||attempt>=this.config.maxRetries||combined.aborted) throw e; await sleep(Math.min(250*2**attempt,4000)); attempt++; }
    }
  }
  esc(v){return encodeURIComponent(v);} 
  listDomains(a,s){return this.request('GET','/v4/domains',{query:{limit:a.limit,skip:a.skip,state:a.state,sort:a.sort},signal:s});}
  getDomain(a,s){return this.request('GET',`/v4/domains/${this.esc(a.domain)}`,{signal:s});}
  queryLogs(a,s){return this.request('POST','/v1/analytics/logs',{body:a,signal:s});}
  queryMetrics(a,s){return this.request('POST','/v1/analytics/metrics',{body:a,signal:s});}
  listTemplates(a,s){return this.request('GET',`/v3/${this.esc(a.domain)}/templates`,{query:{limit:a.limit,page:a.page},signal:s});}
  getTemplate(a,s){return this.request('GET',`/v3/${this.esc(a.domain)}/templates/${this.esc(a.name)}`,{query:{active:a.active},signal:s});}
  createTemplate(a,s){return this.request('POST',`/v3/${this.esc(a.domain)}/templates`,{form:{name:a.name,description:a.description,template:a.template,tag:a.tag,engine:a.engine},signal:s,retrySafe:false});}
  listMailingLists(a,s){return this.request('GET','/v3/lists/pages',{query:{limit:a.limit,address:a.address},signal:s});}
  listMembers(a,s){return this.request('GET',`/v3/lists/${this.esc(a.listAddress)}/members/pages`,{query:{limit:a.limit,subscribed:a.subscribed},signal:s});}
  listRoutes(a,s){return this.request('GET','/v3/routes',{query:{limit:a.limit,skip:a.skip},signal:s});}
  getRoute(a,s){return this.request('GET',`/v3/routes/${this.esc(a.id)}`,{signal:s});}
  listBounces(a,s){return this.request('GET',`/v3/${this.esc(a.domain)}/bounces`,{query:{limit:a.limit,page:a.page},signal:s});}
  listComplaints(a,s){return this.request('GET',`/v3/${this.esc(a.domain)}/complaints`,{query:{limit:a.limit,page:a.page},signal:s});}
  sendMessage(a,s){return this.request('POST',`/v3/${this.esc(a.domain)}/messages`,{form:{from:a.from,to:a.to,cc:a.cc,bcc:a.bcc,subject:a.subject,text:a.text,html:a.html,template:a.template,'h:Reply-To':a.replyTo,'o:tag':a.tags,'v:metadata':a.metadata?JSON.stringify(a.metadata):undefined},signal:s,retrySafe:false});}
}
