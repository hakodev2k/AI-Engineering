import type { Config } from "./config.js";
export class ImgixError extends Error{constructor(public status:number,public retryAfter?:number,public details?:unknown){super(`Imgix API error ${status}`)}}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export class ImgixClient{
 constructor(private c:Config,private fetcher:typeof fetch=fetch){}
 async request(method:string,path:string,opts:{query?:Record<string,string|number|boolean|undefined>;body?:unknown;retrySafe?:boolean}={}){
  if(path.includes("://")||!path.startsWith("/"))throw new Error("INVALID_PATH");
  const u=new URL("https://api.imgix.com/api/v1"+path);for(const [k,v] of Object.entries(opts.query??{}))if(v!==undefined)u.searchParams.set(k,String(v));
  const attempts=opts.retrySafe?this.c.maxReadRetries+1:1;
  for(let i=0;i<attempts;i++){const ac=new AbortController();const t=setTimeout(()=>ac.abort(),this.c.timeoutMs);
   try{const r=await this.fetcher(u,{method,signal:ac.signal,headers:{Authorization:`Bearer ${this.c.apiKey}`,Accept:"application/vnd.api+json","Content-Type":"application/vnd.api+json"},body:opts.body===undefined?undefined:JSON.stringify(opts.body)});
    clearTimeout(t);const text=await r.text();let data:any=null;try{data=text?JSON.parse(text):null}catch{data={raw:text}};
    if(r.ok)return data;const ra=Number(r.headers.get("retry-after")??"0")||undefined;const e=new ImgixError(r.status,ra,data);
    if(i+1<attempts&&(r.status===429||r.status>=500)){await sleep(Math.min((ra??2**i)*1000,10000));continue}throw e;
   }catch(e:any){clearTimeout(t);if(e instanceof ImgixError)throw e;if(i+1<attempts){await sleep(Math.min(250*2**i,2000));continue}if(e?.name==="AbortError")throw new Error("IMGIX_TIMEOUT");throw new Error("IMGIX_NETWORK_ERROR")}
  } throw new Error("UNREACHABLE")
 }
}
