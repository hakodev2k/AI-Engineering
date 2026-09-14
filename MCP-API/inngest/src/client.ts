import { setTimeout as sleep } from "node:timers/promises";

export class InngestError extends Error {
  constructor(public status:number, public code:string, message:string, public retryAfter?:number){ super(message); }
}
export class InngestClient {
  readonly base:string; readonly timeoutMs:number; readonly maxRetries:number;
  constructor(private key=process.env.INNGEST_API_KEY){
    const b=process.env.INNGEST_API_BASE_URL || "https://api.inngest.com/v2";
    if (b !== "https://api.inngest.com/v2") throw new Error("Only the official Inngest Cloud REST origin is allowed.");
    this.base=b; this.timeoutMs=Number(process.env.INNGEST_TIMEOUT_MS||30000); this.maxRetries=Math.min(5,Math.max(0,Number(process.env.INNGEST_MAX_RETRIES||2)));
  }
  available(){ return Boolean(this.key); }
  async request<T>(method:string,path:string,body?:unknown):Promise<T>{
    if(!this.key) throw new InngestError(401,"MISSING_CREDENTIAL","INNGEST_API_KEY is not configured.");
    for(let attempt=0;;attempt++){
      const c=new AbortController(); const timer=setTimeout(()=>c.abort(),this.timeoutMs);
      try{
        const r=await fetch(`${this.base}${path}`,{method,signal:c.signal,headers:{Authorization:`Bearer ${this.key}`,Accept:"application/json",...(body!==undefined?{"Content-Type":"application/json"}:{})},body:body!==undefined?JSON.stringify(body):undefined});
        const text=await r.text(); let data:any=null; try{data=text?JSON.parse(text):null;}catch{data={message:text};}
        if(r.ok) return data as T;
        const ra=Number(r.headers.get("retry-after")||0)||undefined;
        const err=new InngestError(r.status,data?.errors?.[0]?.code||`HTTP_${r.status}`,data?.errors?.[0]?.message||data?.message||r.statusText,ra);
        const retrySafe=method==="GET" && (r.status===429 || [500,502,503,504].includes(r.status));
        if(!retrySafe || attempt>=this.maxRetries) throw err;
        await sleep(Math.min(10_000, ra?ra*1000:250*2**attempt));
      }catch(e){
        if(e instanceof InngestError) throw e;
        if(method!=="GET" || attempt>=this.maxRetries) throw e;
        await sleep(Math.min(5000,250*2**attempt));
      }finally{clearTimeout(timer);}
    }
  }
  get<T>(p:string){return this.request<T>("GET",p);} post<T>(p:string,b:unknown={}){return this.request<T>("POST",p,b);}
}
