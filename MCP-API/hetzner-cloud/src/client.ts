import { config } from './config.js';
type FetchLike=typeof fetch;
export class HetznerError extends Error{constructor(public status:number,public code:string,public details:unknown){super(`Hetzner API ${status}: ${code}`)}}
export class HetznerClient{
  constructor(private fetcher:FetchLike=fetch){}
  async request<T>(method:string,path:string,body?:unknown,retryable=true):Promise<T>{
    if(!config.token) throw new Error('HETZNER_CLOUD_TOKEN is required');
    const base=config.apiBaseUrl.endsWith('/')?config.apiBaseUrl:config.apiBaseUrl+'/';
    const url=new URL(path.replace(/^\//,''),base); let last:unknown;
    for(let attempt=0;attempt<=config.maxRetries;attempt++){
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),config.timeoutMs);
      try{
        const res=await this.fetcher(url,{method,headers:{Authorization:`Bearer ${config.token}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});clearTimeout(timer);
        if(res.ok){if(res.status===204)return undefined as T;return await res.json() as T;}
        const payload=await res.json().catch(()=>({}));const code=(payload as any)?.error?.code??`http_${res.status}`;
        if(res.status===429&&retryable&&attempt<config.maxRetries){const reset=Number(res.headers.get('RateLimit-Reset')??0)*1000;const wait=Math.min(Math.max(reset-Date.now(),250),5000);await new Promise(r=>setTimeout(r,wait));continue;}
        if(res.status>=500&&retryable&&attempt<config.maxRetries){await new Promise(r=>setTimeout(r,Math.min(250*2**attempt,2000)));continue;}
        throw new HetznerError(res.status,code,payload);
      }catch(e){clearTimeout(timer);last=e;if(e instanceof HetznerError)throw e;if(!retryable||attempt>=config.maxRetries)throw e;await new Promise(r=>setTimeout(r,Math.min(250*2**attempt,2000)));}
    }throw last;
  }
  list(resource:string,page=1,perPage=50,labelSelector?:string){const q=new URLSearchParams({page:String(page),per_page:String(perPage)});if(labelSelector)q.set('label_selector',labelSelector);return this.request<any>('GET',`${resource}?${q}`);}
}
