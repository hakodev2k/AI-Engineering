import { TelnyxError } from './security.js';

export class TelnyxClient {
  readonly base:string; readonly key:string; readonly timeout:number;
  constructor(opts:{base?:string,key?:string,timeout?:number}={}){
    this.base=(opts.base??process.env.TELNYX_API_BASE??'https://api.telnyx.com/v2').replace(/\/$/,'');
    this.key=opts.key??process.env.TELNYX_API_KEY??'';
    this.timeout=opts.timeout??Number(process.env.TELNYX_TIMEOUT_MS??15000);
    if(!this.key) throw new TelnyxError('TELNYX_API_KEY is required',401);
  }
  async request(method:string,path:string,body?:unknown,signal?:AbortSignal):Promise<any>{
    if(!path.startsWith('/')) throw new TelnyxError('Invalid provider path');
    let last:unknown;
    for(let attempt=0;attempt<3;attempt++){
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.timeout);
      const abort=()=>controller.abort(); signal?.addEventListener('abort',abort,{once:true});
      try{
        const r=await fetch(this.base+path,{method,headers:{Authorization:`Bearer ${this.key}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
        const text=await r.text(); let data:any; try{data=text?JSON.parse(text):{}}catch{data={message:text}}
        if(r.ok) return data;
        const retryAfter=Number(r.headers.get('retry-after')??0)||undefined;
        const msg=data?.errors?.[0]?.detail??data?.message??`Telnyx HTTP ${r.status}`;
        if([400,401,403,404,409,422].includes(r.status)) throw new TelnyxError(msg,r.status,retryAfter);
        if((r.status===429||r.status>=500)&&attempt<2){await new Promise(res=>setTimeout(res,Math.min((retryAfter??(2**attempt))*1000,10000)));continue;}
        throw new TelnyxError(msg,r.status,retryAfter);
      }catch(e){last=e;if(e instanceof TelnyxError||attempt===2) throw e;await new Promise(r=>setTimeout(r,250*2**attempt));}
      finally{clearTimeout(timer);signal?.removeEventListener('abort',abort)}
    }
    throw last;
  }
}
