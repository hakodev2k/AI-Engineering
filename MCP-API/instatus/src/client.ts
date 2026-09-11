import type {Config} from './config.js';
export class ProviderError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
export class InstatusClient {
 constructor(private c:Config, private fetcher:typeof fetch=fetch){}
 async request<T>(method:string,path:string,body?:unknown,signal?:AbortSignal):Promise<T>{
  const destructive=method==='DELETE'; let attempt=0;
  while(true){ const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.c.timeoutMs); const onAbort=()=>ctrl.abort(); signal?.addEventListener('abort',onAbort,{once:true});
   try { const r=await this.fetcher(`${this.c.baseUrl}${path}`,{method,headers:{Authorization:`Bearer ${this.c.apiKey}`,'Content-Type':'application/json',Accept:'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:ctrl.signal});
    const text=await r.text(); const data=text?JSON.parse(text):null;
    if(r.ok) return data as T;
    const retryAfter=Number(r.headers.get('retry-after')||0); const retryable=!destructive&&(r.status===429||r.status>=500)&&attempt<this.c.maxRetries;
    if(!retryable) throw new ProviderError(r.status,data?.message||data?.error||`Instatus HTTP ${r.status}`,retryAfter||undefined);
    await new Promise(x=>setTimeout(x,retryAfter?retryAfter*1000:250*2**attempt)); attempt++; continue;
   } catch(e){ if(e instanceof ProviderError) throw e; if(destructive||attempt>=this.c.maxRetries) throw e; await new Promise(x=>setTimeout(x,250*2**attempt)); attempt++; }
   finally {clearTimeout(timer);signal?.removeEventListener('abort',onAbort)}
  }
 }
}
