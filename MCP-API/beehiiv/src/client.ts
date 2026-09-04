import type { Config } from './config.js';
export class BeehiivError extends Error{constructor(public status:number,public body:unknown,public retryAfter?:number){super(`beehiiv API ${status}`)}}
export class BeehiivClient{
 constructor(private c:Config,private fetcher:typeof fetch=fetch){}
 async request(method:'GET'|'POST',path:string,opts:{query?:Record<string,string|number|boolean|undefined>;body?:unknown}={}){
  if(!path.startsWith('/')||path.includes('://')||path.includes('..'))throw new Error('Invalid beehiiv API path');
  const u=new URL(`https://api.beehiiv.com/v2${path}`);for(const [k,v] of Object.entries(opts.query??{}))if(v!==undefined)u.searchParams.set(k,String(v));
  const attempts=method==='GET'?this.c.maxRetries+1:1;
  for(let i=0;i<attempts;i++){
   const r=await this.fetcher(u,{method,headers:{Authorization:`Bearer ${this.c.apiKey}`,'Content-Type':'application/json'},body:opts.body===undefined?undefined:JSON.stringify(opts.body),signal:AbortSignal.timeout(this.c.timeoutMs)});
   if(r.ok){if(r.status===204)return{};return await r.json();}
   const text=await r.text();let body:unknown=text;try{body=JSON.parse(text)}catch{}
   const reset=Number(r.headers.get('ratelimit-reset'));const retryAfter=Number(r.headers.get('retry-after'))|| (Number.isFinite(reset)?Math.max(0,reset-Math.floor(Date.now()/1000)):undefined);
   if(method==='GET'&&i<attempts-1&&(r.status===429||r.status>=500)){const delay=Math.min(5000,(retryAfter??Math.pow(2,i))*1000);await new Promise(x=>setTimeout(x,delay));continue;}
   throw new BeehiivError(r.status,body,retryAfter);
  }
  throw new Error('beehiiv request failed');
 }
}
