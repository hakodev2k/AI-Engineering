const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export class OpsgenieError extends Error { constructor(message,status,body,retryAfter){super(message);this.name='OpsgenieError';this.status=status;this.body=body;this.retryAfter=retryAfter;} }
export class OpsgenieClient {
  constructor({apiKey=process.env.OPSGENIE_API_KEY,region=process.env.OPSGENIE_REGION||'us',timeoutMs=Number(process.env.OPSGENIE_TIMEOUT_MS||10000),maxRetries=Number(process.env.OPSGENIE_MAX_RETRIES||2),fetchImpl=fetch}={}){
    if(!apiKey) throw new Error('OPSGENIE_API_KEY is required');
    if(!['us','eu'].includes(region)) throw new Error('OPSGENIE_REGION must be us or eu');
    this.apiKey=apiKey; this.base=region==='eu'?'https://api.eu.opsgenie.com':'https://api.opsgenie.com'; this.timeoutMs=timeoutMs; this.maxRetries=Math.max(0,Math.min(maxRetries,4)); this.fetch=fetchImpl;
  }
  async request(method,path,{query,body,signal,retrySafe=method==='GET'}={}){
    const url=new URL(path,this.base); for(const [k,v] of Object.entries(query||{})) if(v!==undefined&&v!==null&&v!=='') url.searchParams.set(k,String(v));
    for(let attempt=0;;attempt++){
      const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(new Error('Opsgenie request timed out')),this.timeoutMs); const onAbort=()=>ctl.abort(signal.reason); signal?.addEventListener('abort',onAbort,{once:true});
      try{
        const res=await this.fetch(url,{method,headers:{Authorization:`GenieKey ${this.apiKey}`,'Content-Type':'application/json',Accept:'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:ctl.signal});
        const text=await res.text(); let data; try{data=text?JSON.parse(text):null}catch{data={raw:text}}
        if(res.ok) return {data,status:res.status,rateLimitState:res.headers.get('x-ratelimit-state'),requestId:data?.requestId};
        const retryAfter=Number(res.headers.get('retry-after')||0); const retryable=retrySafe&&(res.status===429||res.status>=500)&&attempt<this.maxRetries;
        if(retryable){await sleep(retryAfter>0?retryAfter*1000:Math.min(200*2**attempt+Math.floor(Math.random()*100),3000));continue;}
        throw new OpsgenieError(data?.message||`Opsgenie HTTP ${res.status}`,res.status,data,retryAfter||undefined);
      } finally {clearTimeout(timer);signal?.removeEventListener('abort',onAbort);}
    }
  }
}
