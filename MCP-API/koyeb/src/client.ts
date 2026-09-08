import {setTimeout as delay} from 'node:timers/promises';
import type {Config} from './config.js';
export class KoyebApiError extends Error{constructor(public status:number,public code:string,public retryAfter?:number){super(`${status}:${code}`)}}
export class KoyebRestClient{
  constructor(private cfg:Config, private fetchImpl:typeof fetch=fetch){}
  async request(method:string,path:string,body?:unknown,query?:Record<string,unknown>){
    const url=new URL(path,this.cfg.baseUrl); for(const [k,v] of Object.entries(query||{})) if(v!==undefined&&v!==null) url.searchParams.set(k,String(v));
    for(let attempt=0;attempt<3;attempt++){
      const c=new AbortController(); const timer=setTimeout(()=>c.abort(),this.cfg.timeoutMs);
      try{
        const r=await this.fetchImpl(url,{method,headers:{Authorization:`Bearer ${this.cfg.token}`,'content-type':'application/json','user-agent':'ai-engineering-koyeb-connector/1.0'},body:body===undefined?undefined:JSON.stringify(body),signal:c.signal});
        const text=await r.text(); const data=text?JSON.parse(text):{};
        if(r.ok) return data;
        const ra=Number(r.headers.get('retry-after')||0); const code=String(data?.code||`http_${r.status}`);
        if((r.status===429||r.status>=500)&&attempt<2){await delay(ra>0?Math.min(ra*1000,10000):250*2**attempt);continue;}
        throw new KoyebApiError(r.status,code,ra||undefined);
      }finally{clearTimeout(timer)}
    }
    throw new Error('request failed');
  }
}
