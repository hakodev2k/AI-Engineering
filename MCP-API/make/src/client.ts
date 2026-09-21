import { Config, redact } from './config.js';

export class MakeApiError extends Error { constructor(public status:number, message:string, public retryAfter?:number){ super(message); } }
export class MakeClient {
  constructor(private c:Config, private fetcher:typeof fetch = fetch) {}
  async request(method:string,path:string,query?:Record<string,string|number|boolean|undefined>,body?:unknown){
    if (!path.startsWith('/') || path.includes('..')) throw new Error('INVALID_PATH');
    const url=new URL(this.c.baseUrl+path);
    for(const [k,v] of Object.entries(query??{})) if(v!==undefined) url.searchParams.set(k,String(v));
    const retrySafe=method==='GET';
    for(let attempt=0;;attempt++){
      const ac=new AbortController(); const timer=setTimeout(()=>ac.abort(),this.c.MAKE_TIMEOUT_MS);
      try{
        const r=await this.fetcher(url,{method,headers:{Authorization:`Token ${this.c.MAKE_API_TOKEN}`,Accept:'application/json','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:ac.signal});
        const text=await r.text(); let data:unknown=text; try{data=text?JSON.parse(text):null}catch{}
        if(r.ok) return {data, untrustedProviderContent:true};
        const retryAfter=Number(r.headers.get('retry-after')??'0')||undefined;
        if(retrySafe && attempt<this.c.MAKE_MAX_RETRIES && (r.status===429 || r.status>=500)){ await sleep(Math.min(10000,(retryAfter??Math.pow(2,attempt))*1000)); continue; }
        throw new MakeApiError(r.status,`Make API ${r.status}: ${redact(data)}`,retryAfter);
      } catch(e){
        if(e instanceof MakeApiError) throw e;
        if(retrySafe && attempt<this.c.MAKE_MAX_RETRIES){ await sleep(Math.min(8000,500*Math.pow(2,attempt))); continue; }
        throw new Error(e instanceof Error && e.name==='AbortError'?'NETWORK_OR_TIMEOUT':`NETWORK_OR_TIMEOUT: ${redact(String(e))}`);
      } finally { clearTimeout(timer); }
    }
  }
}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
