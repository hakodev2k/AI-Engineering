import type { Config } from './config.js';

export class SplunkOnCallError extends Error {
  constructor(public status:number, message:string, public retryAfterMs?:number, public body?:unknown){super(message);this.name='SplunkOnCallError';}
}

type RequestOptions={method?:'GET'|'POST';body?:unknown;retryable?:boolean;signal?:AbortSignal};
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));

export class SplunkOnCallClient {
  constructor(private c:Config, private fetchImpl:typeof fetch=fetch){}
  async request(path:string,o:RequestOptions={}):Promise<unknown>{
    if(!path.startsWith('/api-public/')) throw new Error('Only fixed Splunk On-Call public API paths are allowed');
    const method=o.method??'GET'; const retryable=o.retryable??method==='GET';
    for(let attempt=0;;attempt++){
      const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),this.c.timeoutMs);
      const onAbort=()=>ctl.abort(); o.signal?.addEventListener('abort',onAbort,{once:true});
      try{
        const res=await this.fetchImpl(this.c.baseUrl+path,{method,signal:ctl.signal,headers:{'Accept':'application/json','Content-Type':'application/json','X-VO-Api-Id':this.c.apiId,'X-VO-Api-Key':this.c.apiKey,'User-Agent':'ai-engineering-splunk-on-call-mcp/1.0'},body:o.body===undefined?undefined:JSON.stringify(o.body)});
        const text=await res.text(); let data:unknown=text; try{data=text?JSON.parse(text):null;}catch{}
        if(res.ok) return data;
        const ra=res.headers.get('retry-after'); const retryAfterMs=ra?Math.max(0,Number(ra)*1000):undefined;
        if(retryable && (res.status===429 || res.status>=500) && attempt<this.c.maxRetries){await sleep(retryAfterMs??Math.min(500*2**attempt,5000));continue;}
        throw new SplunkOnCallError(res.status,`Splunk On-Call API failed with HTTP ${res.status}`,retryAfterMs,data);
      }catch(e){
        if(e instanceof SplunkOnCallError) throw e;
        if((e as Error).name==='AbortError') throw new Error('Splunk On-Call request timed out or was cancelled');
        if(retryable && attempt<this.c.maxRetries){await sleep(Math.min(500*2**attempt,5000));continue;} throw e;
      }finally{clearTimeout(timer);o.signal?.removeEventListener('abort',onAbort);}
    }
  }
}
