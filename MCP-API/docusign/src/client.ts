import type { Config } from "./config.js";
export class DocusignApiError extends Error{constructor(public status:number,msg:string,public retryAfter?:string){super(msg);this.name="DocusignApiError";}}
export class DocusignClient{
 constructor(private c:Config,private f:typeof fetch=fetch){}
 request(method:string,path:string,body?:unknown,q?:Record<string,string|undefined>){const u=new URL(this.c.baseUrl+path);for(const[k,v]of Object.entries(q??{}))if(v!==undefined)u.searchParams.set(k,v);return this.call(method,u.toString(),body);}
 userInfo(){return this.call("GET",this.c.oauthBaseUrl+"/oauth/userinfo");}
 private async call(method:string,url:string,body?:unknown){const safe=method==="GET";let n=0;
  while(true){const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),this.c.timeoutMs);
   try{const r=await this.f(url,{method,signal:ac.signal,headers:{Authorization:`Bearer ${this.c.accessToken}`,Accept:"application/json",...(body===undefined?{}:{"Content-Type":"application/json"})},body:body===undefined?undefined:JSON.stringify(body)});
    const t=await r.text();let data:unknown=t;if(t)try{data=JSON.parse(t)}catch{}
    if(r.ok)return{data,meta:{requestId:r.headers.get("x-docusign-tracetoken"),rateLimitRemaining:r.headers.get("x-ratelimit-remaining"),rateLimitReset:r.headers.get("x-ratelimit-reset")}};
    if(safe&&(r.status===429||r.status>=500)&&n<this.c.maxRetries){const h=r.headers.get("retry-after");const d=h&&/^\d+$/.test(h)?+h*1000:Math.min(250*2**n,2000);n++;await new Promise(x=>setTimeout(x,d));continue;}
    throw new DocusignApiError(r.status,typeof data==="string"?data:JSON.stringify(data),r.headers.get("retry-after")??undefined);
   }catch(e){if(safe&&!(e instanceof DocusignApiError)&&n<this.c.maxRetries){n++;await new Promise(x=>setTimeout(x,Math.min(250*2**(n-1),2000)));continue;}throw e;}finally{clearTimeout(timer);}
  }
 }
}
