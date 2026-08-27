import type { Config } from './config.js';

export class PipedriveError extends Error { constructor(public status:number, message:string, public retryAfterMs?:number){ super(message); } }
export class PipedriveClient {
  constructor(private cfg:Config, private fetchImpl:typeof fetch=fetch){}
  async request<T>(method:string,path:string,body?:unknown,query:Record<string,string|number|undefined>={}):Promise<T>{
    const url=new URL(path,this.cfg.apiBaseUrl);
    for(const [k,v] of Object.entries(query)) if(v!==undefined) url.searchParams.set(k,String(v));
    if(this.cfg.authMode==='api_token') url.searchParams.set('api_token',this.cfg.apiToken!);
    const headers:Record<string,string>={'accept':'application/json'};
    if(this.cfg.authMode==='oauth2') headers.authorization=`Bearer ${this.cfg.accessToken}`;
    if(body!==undefined) headers['content-type']='application/json';
    const retryable=['GET','HEAD'].includes(method.toUpperCase());
    let attempt=0;
    while(true){
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),this.cfg.timeoutMs);
      try{
        const res=await this.fetchImpl(url,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
        const text=await res.text(); let payload:any=text; try{payload=text?JSON.parse(text):null;}catch{}
        if(res.ok) return payload as T;
        const retryAfter=parseRetryAfter(res.headers.get('retry-after'));
        if(retryable && attempt<this.cfg.maxRetries && (res.status===429||res.status===502||res.status===503||res.status===504)){ await sleep(retryAfter ?? 250*(2**attempt)); attempt++; continue; }
        const message=typeof payload==='object'&&payload?.error?String(payload.error):`Pipedrive HTTP ${res.status}`;
        throw new PipedriveError(res.status,message,retryAfter);
      }catch(err){
        if(err instanceof PipedriveError) throw err;
        if(retryable && attempt<this.cfg.maxRetries){await sleep(250*(2**attempt));attempt++;continue;}
        if((err as Error).name==='AbortError') throw new Error(`Pipedrive request timed out after ${this.cfg.timeoutMs}ms`);
        throw err;
      }finally{clearTimeout(timer);}
    }
  }
  get<T>(path:string,q:Record<string,string|number|undefined>={}){return this.request<T>('GET',path,undefined,q)}
  post<T>(path:string,b:unknown){return this.request<T>('POST',path,b)}
  put<T>(path:string,b:unknown){return this.request<T>('PUT',path,b)}
  delete<T>(path:string){return this.request<T>('DELETE',path)}
}
function sleep(ms:number){return new Promise(r=>setTimeout(r,Math.min(ms,10000)))}
function parseRetryAfter(v:string|null){if(!v)return undefined;const n=Number(v);if(Number.isFinite(n))return Math.max(0,n*1000);const d=Date.parse(v);return Number.isNaN(d)?undefined:Math.max(0,d-Date.now());}
