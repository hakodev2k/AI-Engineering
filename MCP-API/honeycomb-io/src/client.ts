import type {HoneycombConfig} from './auth.js';
export class HoneycombError extends Error { constructor(public status:number, message:string, public retryAfter?:string){super(message);this.name='HoneycombError';} }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export class HoneycombClient {
  constructor(private c:HoneycombConfig, private fetcher:typeof fetch=fetch){}
  async request<T>(method:string,path:string,body?:unknown):Promise<T>{
    const retryable=method==='GET';
    for(let attempt=0;;attempt++){
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.c.timeoutMs);
      try{
        const res=await this.fetcher(`${this.c.baseUrl}${path}`,{method,headers:{'X-Honeycomb-Team':this.c.apiKey,'Content-Type':'application/json','Accept':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
        const text=await res.text(); let data:unknown=text; try{data=text?JSON.parse(text):null;}catch{}
        if(res.ok) return data as T;
        const retryAfter=res.headers.get('Retry-After')??undefined;
        if(retryable&&(res.status===429||res.status>=500)&&attempt<this.c.maxRetries){
          const seconds=retryAfter&&/^\d+$/.test(retryAfter)?Number(retryAfter):Math.min(2**attempt,8); await sleep(seconds*1000); continue;
        }
        throw new HoneycombError(res.status,`Honeycomb API ${res.status}: ${typeof data==='string'?data:JSON.stringify(data)}`,retryAfter);
      } catch(e){
        if(e instanceof HoneycombError) throw e;
        if(retryable&&attempt<this.c.maxRetries&&!(e instanceof DOMException&&e.name==='AbortError')){await sleep(Math.min(2**attempt,8)*1000);continue;}
        if(e instanceof DOMException&&e.name==='AbortError') throw new HoneycombError(408,'Honeycomb request timed out');
        throw e;
      } finally {clearTimeout(timer);}
    }
  }
}
