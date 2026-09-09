import type {BitlyConfig} from './config.js';
export class BitlyError extends Error{constructor(public status:number,public code:string,public retryAfter?:number){super(`Bitly API ${status}: ${code}`)}}
export class BitlyClient{
  constructor(private cfg:BitlyConfig,private fetcher:typeof fetch=fetch){}
  private async sleep(ms:number){await new Promise(r=>setTimeout(r,ms))}
  async request(method:'GET'|'POST'|'PATCH'|'DELETE',path:string,body?:unknown,query?:Record<string,unknown>){
    const url=new URL(this.cfg.baseUrl+path);for(const[k,v]of Object.entries(query??{})){if(v!==undefined&&v!==null&&v!=='')url.searchParams.set(k,Array.isArray(v)?v.join(','):String(v))}
    for(let attempt=0;;attempt++){
      const ac=new AbortController();const timer=setTimeout(()=>ac.abort(),this.cfg.timeoutMs);
      try{
        const res=await this.fetcher(url,{method,headers:{Authorization:`Bearer ${this.cfg.token}`,Accept:'application/json',...(body!==undefined?{'Content-Type':'application/json'}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:ac.signal});
        const text=await res.text();let data:unknown=text;try{data=text?JSON.parse(text):null}catch{}
        if(res.ok)return data;
        const obj=(data&&typeof data==='object'?data:{}) as Record<string,unknown>;const code=String(obj.message??obj.description??obj.resource??res.statusText??'UNKNOWN_ERROR');
        const retryHeader=res.headers.get('retry-after');const retryAfter=retryHeader?Number(retryHeader):undefined;
        const retryable=method==='GET'&&(res.status===502||res.status===503||res.status===504||(res.status===429&&Number.isFinite(retryAfter)));
        if(retryable&&attempt<this.cfg.maxRetries){await this.sleep(Number.isFinite(retryAfter)?Math.max(0,retryAfter!)*1000:250*2**attempt);continue}
        throw new BitlyError(res.status,code,Number.isFinite(retryAfter)?retryAfter:undefined);
      }catch(e){if(e instanceof BitlyError)throw e;if((e as Error).name==='AbortError')throw new Error(`Bitly request timed out after ${this.cfg.timeoutMs}ms`);if(method==='GET'&&attempt<this.cfg.maxRetries){await this.sleep(250*2**attempt);continue}throw e}finally{clearTimeout(timer)}
    }
  }
}
export function bitlinkPath(id:string){if(!/^[A-Za-z0-9.-]+\/[A-Za-z0-9_-]+$/.test(id)||id.includes('..'))throw new Error('bitlink_id must be a domain/hash pair');return `/bitlinks/${id}`}
