import {config} from './security.js';
export class ResendClient{
  private c=config();
  async request(method:string,path:string,body?:unknown,signal?:AbortSignal){
    let last:unknown;
    for(let i=0;i<=this.c.maxRetries;i++){
      const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.c.timeout);
      const combined=signal?AbortSignal.any([signal,ctrl.signal]):ctrl.signal;
      try{
        const r=await fetch(`https://api.resend.com${path}`,{method,headers:{Authorization:`Bearer ${this.c.apiKey}`,'Content-Type':'application/json','User-Agent':'daily-mcp-resend/1.0'},body:body===undefined?undefined:JSON.stringify(body),signal:combined});
        const text=await r.text(); const data=text?JSON.parse(text):{};
        if(r.ok) return data;
        const retryable=r.status===429||r.status>=500;
        if(!retryable||i===this.c.maxRetries) throw new Error(`Resend ${r.status}: ${data?.message??text}`);
        const ra=Number(r.headers.get('retry-after')); await new Promise(x=>setTimeout(x,Number.isFinite(ra)&&ra>0?ra*1000:250*2**i));
      }catch(e){last=e;if(i===this.c.maxRetries || (e instanceof Error && /Resend 4(?!29)/.test(e.message))) throw e;await new Promise(x=>setTimeout(x,250*2**i));}
      finally{clearTimeout(timer)}
    }
    throw last;
  }
}
