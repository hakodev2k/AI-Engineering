import type {Config} from './config.js';
export class UmamiError extends Error { constructor(public status:number,public code:string,message:string,public retryAfter?:number){super(message)} }
export class UmamiClient {
 constructor(private c:Config,private fetcher:typeof fetch=fetch){}
 private url(path:string,q?:Record<string,string|number|undefined>){const region=this.c.region?`/${this.c.region}`:'';const u=new URL(`${this.c.baseUrl}${region}${path}`);for(const [k,v] of Object.entries(q||{})) if(v!==undefined)u.searchParams.set(k,String(v));return u;}
 async request<T>(method:string,path:string,q?:Record<string,string|number|undefined>,body?:unknown):Promise<T>{
  const retryable=method==='GET'; let attempt=0;
  while(true){const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),this.c.timeoutMs);try{
   const r=await this.fetcher(this.url(path,q),{method,headers:{Accept:'application/json',Authorization:`Bearer ${this.c.apiKey}`,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:ctl.signal});
   const text=await r.text();const data=text?JSON.parse(text):null;
   if(r.ok)return data as T;
   const retryAfter=Number(r.headers.get('retry-after')||0); if(retryable&&(r.status===429||r.status>=500)&&attempt<2){await new Promise(x=>setTimeout(x,retryAfter?retryAfter*1000:250*2**attempt));attempt++;continue}
   throw new UmamiError(r.status,r.status===429?'RATE_LIMIT':'UPSTREAM_ERROR',data?.message||data?.error||`Umami HTTP ${r.status}`,retryAfter||undefined);
  }catch(e){if(e instanceof UmamiError)throw e;if(retryable&&attempt<2){await new Promise(x=>setTimeout(x,250*2**attempt));attempt++;continue}throw new UmamiError(0,'NETWORK_ERROR',e instanceof Error?e.message:String(e));}finally{clearTimeout(timer)}}
 }
 listWebsites(page=1,pageSize=20,query?:string){return this.request<any>('GET','/websites',{page,pageSize,query})}
 getWebsite(id:string){return this.request<any>('GET',`/websites/${id}`)}
 active(id:string){return this.request<any>('GET',`/websites/${id}/active`)}
 stats(id:string,startAt:number,endAt:number){return this.request<any>('GET',`/websites/${id}/stats`,{startAt,endAt})}
 pageviews(id:string,startAt:number,endAt:number,unit:string,timezone?:string){return this.request<any>('GET',`/websites/${id}/pageviews`,{startAt,endAt,unit,timezone})}
 metrics(id:string,startAt:number,endAt:number,type:string,limit=100,offset=0){return this.request<any>('GET',`/websites/${id}/metrics`,{startAt,endAt,type,limit,offset})}
 events(id:string,startAt:number,endAt:number,page=1,pageSize=20,search?:string){return this.request<any>('GET',`/websites/${id}/events`,{startAt,endAt,page,pageSize,search})}
 eventStats(id:string,startAt:number,endAt:number,compare?:string){return this.request<any>('GET',`/websites/${id}/events/stats`,{startAt,endAt,compare})}
 realtime(id:string){return this.request<any>('GET',`/realtime/${id}`)}
 createWebsite(name:string,domain:string,shareId?:string){return this.request<any>('POST','/websites',undefined,{name,domain,shareId})}
 updateWebsite(id:string,data:{name?:string;domain?:string;shareId?:string|null}){return this.request<any>('POST',`/websites/${id}`,undefined,data)}
 deleteWebsite(id:string){return this.request<any>('DELETE',`/websites/${id}`)}
}
