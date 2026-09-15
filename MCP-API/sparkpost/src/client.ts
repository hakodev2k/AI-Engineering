import type { Config } from './config.js';

export class SparkPostError extends Error { constructor(public status:number, message:string, public retryAfter?:number){ super(message); } }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export class SparkPostClient {
  constructor(private c:Config, private fetcher:typeof fetch=fetch) {}
  async request<T>(method:string,path:string,body?:unknown,opts:{idempotencyKey?:string;retry?:boolean}={}):Promise<T>{
    const attempts=opts.retry===false?1:3;
    for(let i=0;i<attempts;i++){
      const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),this.c.timeoutMs);
      try{
        const headers:Record<string,string>={Authorization:this.c.apiKey,'Content-Type':'application/json'};
        if(opts.idempotencyKey) headers['Idempotency-Key']=opts.idempotencyKey;
        const res=await this.fetcher(`${this.c.baseUrl}${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:ctl.signal});
        if(res.ok){ if(res.status===204)return undefined as T; return await res.json() as T; }
        const text=await res.text(); const ra=Number(res.headers.get('retry-after')||'0')||undefined;
        if(res.status===429 && i+1<attempts){ await sleep((ra??Math.min(5,2**i))*1000); continue; }
        if(res.status>=500 && i+1<attempts && method==='GET'){ await sleep(250*2**i); continue; }
        throw new SparkPostError(res.status,text.slice(0,2000),ra);
      } catch(e){
        if(e instanceof SparkPostError) throw e;
        if(i+1>=attempts) throw e;
        if(method!=='GET') throw e;
        await sleep(250*2**i);
      } finally { clearTimeout(timer); }
    }
    throw new Error('Unreachable');
  }
}
