export class DaprError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
export type ClientOptions={endpoint:string;token?:string;timeoutMs:number;maxRetries:number;fetchImpl?:typeof fetch};
export class DaprClient {
  private f:typeof fetch;
  constructor(private o:ClientOptions){this.f=o.fetchImpl??fetch;if(!/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(?::\d+)?$/i.test(o.endpoint)) throw new Error('DAPR_HTTP_ENDPOINT must target loopback; expose remote sidecars through a trusted local proxy');}
  async request(path:string, init:RequestInit={}, retryable=true):Promise<any>{
    const method=(init.method??'GET').toUpperCase(); const canRetry=retryable&&['GET','HEAD'].includes(method);
    for(let a=0;;a++){
      const c=new AbortController(); const t=setTimeout(()=>c.abort(),this.o.timeoutMs);
      try{
        const h=new Headers(init.headers); h.set('accept','application/json'); if(this.o.token)h.set('dapr-api-token',this.o.token); if(init.body&&!h.has('content-type'))h.set('content-type','application/json');
        const r=await this.f(`${this.o.endpoint}${path}`,{...init,headers:h,signal:c.signal}); const text=await r.text(); const data=text?(()=>{try{return JSON.parse(text)}catch{return text}})():null;
        if(r.ok)return data; const ra=Number(r.headers.get('retry-after')??0); if(canRetry&&(r.status===429||r.status>=500)&&a<this.o.maxRetries){await new Promise(x=>setTimeout(x,ra>0?ra*1000:Math.min(2000,200*2**a)));continue} throw new DaprError(r.status,typeof data==='string'?data:JSON.stringify(data),ra||undefined);
      }catch(e){if(canRetry&&a<this.o.maxRetries&&e instanceof TypeError){await new Promise(x=>setTimeout(x,200*2**a));continue}throw e}finally{clearTimeout(t)}
    }
  }
}
export function clientFromEnv(fetchImpl?:typeof fetch){return new DaprClient({endpoint:(process.env.DAPR_HTTP_ENDPOINT??'http://127.0.0.1:3500').replace(/\/$/,''),token:process.env.DAPR_API_TOKEN,timeoutMs:Number(process.env.DAPR_TIMEOUT_MS??10000),maxRetries:Number(process.env.DAPR_MAX_RETRIES??2),fetchImpl});}
