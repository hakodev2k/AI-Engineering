const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export class LaunchDarklyError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message);} }
export class LaunchDarklyClient {
  private base=process.env.LAUNCHDARKLY_API_BASE_URL ?? 'https://app.launchdarkly.com/api/v2';
  private version=process.env.LAUNCHDARKLY_API_VERSION ?? '20240415';
  private timeout=Number(process.env.LAUNCHDARKLY_TIMEOUT_MS ?? 15000);
  private retries=Number(process.env.LAUNCHDARKLY_MAX_RETRIES ?? 2);
  constructor(private token=process.env.LAUNCHDARKLY_ACCESS_TOKEN){if(!token) throw new Error('LAUNCHDARKLY_ACCESS_TOKEN is required');}
  async request(path:string, init:RequestInit={}, retryable=true):Promise<any>{
    if(!path.startsWith('/')) throw new Error('Provider-relative path required');
    for(let attempt=0;;attempt++){
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.timeout);
      try{
        const res=await fetch(this.base+path,{...init,signal:controller.signal,headers:{Authorization:this.token!,'LD-API-Version':this.version,'Content-Type':'application/json',Accept:'application/json',...(init.headers??{})}});
        const text=await res.text(); let data:any=text; try{data=text?JSON.parse(text):null;}catch{}
        if(res.ok) return data;
        const retryAfter=Number(res.headers.get('retry-after')??0);
        const canRetry=retryable && attempt<this.retries && (res.status===429 || res.status>=500);
        if(canRetry){const wait=retryAfter>0?retryAfter*1000:Math.min(4000,250*2**attempt)+Math.floor(Math.random()*100); await sleep(wait); continue;}
        throw new LaunchDarklyError(res.status, typeof data==='object'?(data.message??JSON.stringify(data)):String(data), retryAfter||undefined);
      } catch(e:any){
        if(e instanceof LaunchDarklyError) throw e;
        if(attempt<this.retries && retryable && e?.name!=='AbortError'){await sleep(250*2**attempt);continue;}
        if(e?.name==='AbortError') throw new Error(`LaunchDarkly request timed out after ${this.timeout}ms`);
        throw e;
      } finally {clearTimeout(timer);}
    }
  }
  get(path:string){return this.request(path);}
  post(path:string,body:any){return this.request(path,{method:'POST',body:JSON.stringify(body)},false);}
  patch(path:string,body:any){return this.request(path,{method:'PATCH',body:JSON.stringify(body)},false);}
  delete(path:string){return this.request(path,{method:'DELETE'},false);}
}
export const qs=(o:Record<string,string|number|undefined>)=>{const q=new URLSearchParams();for(const[k,v]of Object.entries(o))if(v!==undefined)q.set(k,String(v));return q.toString()?`?${q}`:''};
