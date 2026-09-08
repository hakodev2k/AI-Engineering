import {setTimeout as sleep} from 'node:timers/promises';
import type {CrispConfig} from './config.js';
export class CrispApiError extends Error{constructor(public status:number,public reason:string,public retryAfterMs?:number){super(`Crisp API ${status}: ${reason}`)}}
export class CrispClient{
  constructor(private cfg:CrispConfig,private fetchImpl:typeof fetch=fetch){}
  website(input?:string){const id=input||this.cfg.websiteId;if(!id)throw new Error('website_id is required when CRISP_WEBSITE_ID is not configured');if(!/^[0-9a-f-]{36}$/i.test(id))throw new Error('Invalid website_id');return id;}
  async request(method:string,path:string,{query,body,retryReads=true}:{query?:Record<string,string|number|boolean|undefined>;body?:unknown;retryReads?:boolean}={}){
    const url=new URL(`/v1${path}`,this.cfg.baseUrl); for(const [k,v] of Object.entries(query||{}))if(v!==undefined)url.searchParams.set(k,String(v));
    const attempts=retryReads&&['GET','HEAD'].includes(method)?3:1;
    for(let attempt=0;attempt<attempts;attempt++){
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.cfg.timeoutMs);
      try{
        const auth=Buffer.from(`${this.cfg.identifier}:${this.cfg.key}`).toString('base64');
        const res=await this.fetchImpl(url,{method,headers:{Authorization:`Basic ${auth}`,'X-Crisp-Tier':this.cfg.tier,'Content-Type':'application/json','User-Agent':'AI-Engineering-Crisp-Connector/1.0'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
        const text=await res.text(); let parsed:any={}; if(text){try{parsed=JSON.parse(text)}catch{parsed={raw:text}}}
        if(res.ok&&!parsed?.error)return parsed?.data??parsed;
        const reason=String(parsed?.reason||parsed?.message||`HTTP_${res.status}`); const retryHeader=res.headers.get('retry-after'); const retryAfterMs=retryHeader?Math.min(Number(retryHeader)*1000,30000):undefined;
        if((res.status===420||res.status===429||res.status>=500)&&attempt<attempts-1){await sleep(retryAfterMs||250*2**attempt);continue;}
        throw new CrispApiError(res.status,reason,retryAfterMs);
      }catch(e){if((e as Error).name==='AbortError')throw new Error('CRISP_TIMEOUT');throw e;}finally{clearTimeout(timer)}
    }
    throw new Error('CRISP_REQUEST_FAILED');
  }
}
