import type {Config} from './config.js';
export class TypesenseError extends Error{constructor(public status:number,public code:string,message:string,public retryAfter?:number){super(message)}}
export class TypesenseClient{
  constructor(private cfg:Config,private http:typeof fetch=fetch){}
  async request(method:string,path:string,body?:unknown,query?:Record<string,unknown>){
    const url=new URL(this.cfg.host+path);
    for(const[k,v]of Object.entries(query??{}))if(v!==undefined&&v!==null)url.searchParams.set(k,String(v));
    const read=method==='GET'; const attempts=read?this.cfg.maxReadRetries+1:1;
    for(let i=0;i<attempts;i++){
      const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),this.cfg.timeoutMs);
      try{
        const r=await this.http(url,{method,headers:{'X-TYPESENSE-API-KEY':this.cfg.apiKey,'Content-Type':'application/json','Accept':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:ctl.signal});
        const text=await r.text(); let data:unknown=text; try{data=text?JSON.parse(text):null}catch{}
        if(r.ok)return data;
        const retryAfter=parseRetryAfter(r.headers.get('retry-after'));
        const msg=typeof data==='object'&&data&&'message'in data?String((data as any).message):`Typesense HTTP ${r.status}`;
        const err=new TypesenseError(r.status,r.status===401?'AUTH':r.status===403?'PERMISSION':r.status===404?'NOT_FOUND':r.status===429?'RATE_LIMIT':'PROVIDER_ERROR',msg,retryAfter);
        if(read&&i+1<attempts&&(r.status===429||r.status>=500)){await sleep(Math.min(5000,retryAfter??250*2**i));continue} throw err;
      }catch(e){
        if(e instanceof TypesenseError)throw e;
        if((e as Error).name==='AbortError')throw new TypesenseError(408,'TIMEOUT',`Typesense request timed out after ${this.cfg.timeoutMs}ms`);
        if(read&&i+1<attempts){await sleep(Math.min(5000,250*2**i));continue} throw new TypesenseError(0,'NETWORK',e instanceof Error?e.message:'Network error');
      }finally{clearTimeout(timer)}
    } throw new TypesenseError(0,'NETWORK','Request failed');
  }
}
function parseRetryAfter(v:string|null){if(!v)return undefined;const n=Number(v);if(Number.isFinite(n))return n*1000;const d=Date.parse(v);return Number.isNaN(d)?undefined:Math.max(0,d-Date.now())}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
