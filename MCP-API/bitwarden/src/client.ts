import { BitwardenAuth } from './auth.js';
export class BitwardenError extends Error { constructor(message:string, public status?:number, public retryAfter?:string){super(message)} }
export class BitwardenClient {
  constructor(private auth:BitwardenAuth, private baseUrl:string, private timeoutMs=10_000, private fetcher:typeof fetch=fetch){}
  async request(path:string, query:Record<string,string|undefined>={}):Promise<unknown>{
    const url=new URL(`/public/${path.replace(/^\//,'')}`,this.baseUrl);
    for(const [k,v] of Object.entries(query)) if(v!==undefined) url.searchParams.set(k,v);
    if(!['https:','http:'].includes(url.protocol)) throw new Error('Invalid Bitwarden API URL');
    for(let attempt=0;attempt<3;attempt++){
      const c=new AbortController(); const timer=setTimeout(()=>c.abort(),this.timeoutMs);
      try{
        const token=await this.auth.token(c.signal);
        const r=await this.fetcher(url,{headers:{authorization:`Bearer ${token}`,accept:'application/json'},signal:c.signal});
        if(r.status===401){this.auth.invalidate();throw new BitwardenError('Authentication failed or token expired',401)}
        if(r.status===400||r.status===403||r.status===404) throw new BitwardenError(`Bitwarden request rejected (${r.status})`,r.status);
        if(r.status===429||r.status>=500){
          if(attempt===2) throw new BitwardenError(`Bitwarden transient error (${r.status})`,r.status,r.headers.get('retry-after')??undefined);
          const retry=Number(r.headers.get('retry-after')); await new Promise(x=>setTimeout(x,Number.isFinite(retry)?retry*1000:250*2**attempt)); continue;
        }
        if(!r.ok) throw new BitwardenError(`Bitwarden API error (${r.status})`,r.status);
        return await r.json();
      } catch(e){ if(e instanceof BitwardenError) throw e; if((e as Error).name==='AbortError') throw new BitwardenError('Bitwarden request timed out'); if(attempt===2) throw e; await new Promise(x=>setTimeout(x,250*2**attempt)); }
      finally{clearTimeout(timer)}
    }
    throw new Error('unreachable');
  }
}
