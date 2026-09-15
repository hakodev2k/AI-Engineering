import type { Config } from './config.js';
export class ButtondownError extends Error{constructor(message:string,public status?:number,public retryAfterMs?:number){super(message)}}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export class ButtondownClient{
 constructor(private cfg:Config,private fetcher:typeof fetch=fetch){}
 async request(method:string,path:string,opts:{query?:Record<string,string|number|undefined>;body?:unknown;retrySafe?:boolean}={}){
  if(!path.startsWith('/')||path.includes('://'))throw new Error('Invalid provider path');
  const url=new URL(this.cfg.baseUrl+path);for(const [k,v] of Object.entries(opts.query??{}))if(v!==undefined)url.searchParams.set(k,String(v));
  const attempts=opts.retrySafe?this.cfg.maxReadRetries+1:1;
  for(let i=0;i<attempts;i++){
   const c=new AbortController();const timer=setTimeout(()=>c.abort(),this.cfg.timeoutMs);
   try{
    const res=await this.fetcher(url,{method,signal:c.signal,headers:{Authorization:`Token ${this.cfg.apiKey}`,'X-API-Version':this.cfg.apiVersion,'Content-Type':'application/json'},body:opts.body===undefined?undefined:JSON.stringify(opts.body)});
    const text=await res.text();const data=text?(()=>{try{return JSON.parse(text)}catch{return {message:text.slice(0,1000)}}})():{};
    if(res.ok)return {data,rateLimit:{limit:res.headers.get('x-ratelimit-limit'),remaining:res.headers.get('x-ratelimit-remaining'),reset:res.headers.get('x-ratelimit-reset')}};
    const ra=Number(res.headers.get('retry-after'));const retryAfterMs=Number.isFinite(ra)?Math.min(ra*1000,30000):undefined;
    if(opts.retrySafe&&i+1<attempts&&(res.status===429||res.status>=500)){await sleep(retryAfterMs??Math.min(250*2**i,4000));continue}
    throw new ButtondownError(`Buttondown ${res.status}: ${typeof data?.detail==='string'?data.detail:typeof data?.message==='string'?data.message:'request failed'}`,res.status,retryAfterMs);
   }catch(e){if(e instanceof ButtondownError)throw e;if(opts.retrySafe&&i+1<attempts){await sleep(Math.min(250*2**i,4000));continue}throw new ButtondownError(e instanceof Error&&e.name==='AbortError'?'Buttondown request timed out':'Buttondown network failure')}
   finally{clearTimeout(timer)}
  } throw new ButtondownError('Buttondown request failed');
 }
}
