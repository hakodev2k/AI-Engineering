export class HetznerError extends Error {
  constructor(public status:number, message:string, public retryAfter?:number){super(message);}
}
export type ClientOptions={token:string;baseUrl?:string;timeoutMs?:number;maxRetries?:number;fetchImpl?:typeof fetch};
export class HetznerClient {
  private base:string; private timeout:number; private retries:number; private f:typeof fetch;
  constructor(private o:ClientOptions){if(!o.token) throw new Error('HETZNER_API_TOKEN is required');this.base=(o.baseUrl??'https://api.hetzner.cloud/v1').replace(/\/$/,'');this.timeout=o.timeoutMs??15000;this.retries=o.maxRetries??2;this.f=o.fetchImpl??fetch;}
  async request<T>(method:string,path:string,body?:unknown,signal?:AbortSignal):Promise<T>{
    const retryable=method==='GET';
    for(let attempt=0;;attempt++){
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.timeout);
      const onAbort=()=>controller.abort(); signal?.addEventListener('abort',onAbort,{once:true});
      try{
        const r=await this.f(this.base+path,{method,headers:{Authorization:`Bearer ${this.o.token}`,Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:controller.signal});
        const text=await r.text(); const data=text?JSON.parse(text):{};
        if(r.ok) return data as T;
        const reset=Number(r.headers.get('ratelimit-reset')); const retryAfter=r.status===429&&reset?Math.max(0,reset-Math.floor(Date.now()/1000)):undefined;
        if(retryable && (r.status===429||r.status>=500) && attempt<this.retries){await new Promise(x=>setTimeout(x,Math.min(5000,(retryAfter??(2**attempt))*1000)));continue;}
        throw new HetznerError(r.status,data?.error?.message??`Hetzner HTTP ${r.status}`,retryAfter);
      }catch(e){if(retryable&&attempt<this.retries&&e instanceof TypeError){await new Promise(x=>setTimeout(x,250*2**attempt));continue;}throw e;}finally{clearTimeout(timer);signal?.removeEventListener('abort',onAbort);}
    }
  }
  list(resource:string,page=1,perPage=25){return this.request<any>('GET',`/${resource}?page=${page}&per_page=${perPage}`);}
  getServer(id:number){return this.request<any>('GET',`/servers/${id}`);}
  createServer(body:unknown){return this.request<any>('POST','/servers',body);}
  serverAction(id:number,action:'poweron'|'poweroff'|'reboot'){return this.request<any>('POST',`/servers/${id}/actions/${action}`,{});}
  deleteServer(id:number){return this.request<any>('DELETE',`/servers/${id}`);}
}
