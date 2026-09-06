import type { Config } from "./config.js";

export class ShortcutApiError extends Error {
  constructor(public status:number, message:string, public retryAfter?:string, public body?:unknown){super(message);}
}

type Method="GET"|"POST"|"PUT";
export class ShortcutClient {
  constructor(private config:Config, private fetcher:typeof fetch=fetch){}
  async request<T=unknown>(method:Method,path:string,body?:unknown,query?:Record<string,string|number|boolean|undefined>):Promise<T>{
    const url=new URL(this.config.baseUrl+path);
    for(const [k,v] of Object.entries(query??{})) if(v!==undefined) url.searchParams.set(k,String(v));
    let last:unknown;
    for(let attempt=0;attempt<=this.config.maxRetries;attempt++){
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.config.timeoutMs);
      try{
        const response=await this.fetcher(url,{method,headers:{"Accept":"application/json","Content-Type":"application/json","Shortcut-Token":this.config.token},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
        const text=await response.text(); let parsed:unknown=text; try{parsed=text?JSON.parse(text):null;}catch{}
        if(response.ok) return parsed as T;
        const retryAfter=response.headers.get("retry-after")??undefined;
        const msg=typeof parsed==="object"&&parsed&&"message" in parsed?String((parsed as {message:unknown}).message):`Shortcut API request failed (${response.status}).`;
        const err=new ShortcutApiError(response.status,msg,retryAfter,parsed);
        if((response.status===429||response.status>=500)&&attempt<this.config.maxRetries){const ms=retryAfter?Math.min(Number(retryAfter)*1000,10000):Math.min(250*2**attempt,4000); await new Promise(r=>setTimeout(r,Number.isFinite(ms)?ms:500)); last=err; continue;}
        throw err;
      }catch(e){
        if(e instanceof ShortcutApiError) throw e;
        last=e;
        if(attempt>=this.config.maxRetries) throw e instanceof Error?e:new Error(String(e));
        await new Promise(r=>setTimeout(r,Math.min(250*2**attempt,4000)));
      }finally{clearTimeout(timer);}
    }
    throw last instanceof Error?last:new Error("Shortcut request failed.");
  }
}
