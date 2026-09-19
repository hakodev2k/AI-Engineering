export class ProviderError extends Error { constructor(public code:string,message:string,public status?:number,public retryAfter?:number){super(message)} }
export class UptimeRobotClient {
  constructor(private key:string,private base='https://api.uptimerobot.com/v3',private timeout=15000){if(!key)throw new Error('UPTIMEROBOT_API_KEY is required'); if(new URL(base).protocol!=='https:')throw new Error('API base URL must use HTTPS')}
  async request(method:string,path:string,body?:unknown,retryRead=true):Promise<any>{
    if(!path.startsWith('/')||path.includes('..')||path.includes('://'))throw new Error('Unsafe provider path');
    const attempts=retryRead&&['GET','HEAD'].includes(method)?3:1;
    for(let i=0;i<attempts;i++){
      const ac=new AbortController(); const timer=setTimeout(()=>ac.abort(),this.timeout);
      try{
        const r=await fetch(this.base+path,{method,headers:{Authorization:`Bearer ${this.key}`,'Content-Type':'application/json',Accept:'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:ac.signal});
        const text=await r.text(); let data:any={}; try{data=text?JSON.parse(text):{}}catch{data={raw:text.slice(0,4000)}}
        if(r.ok)return data;
        const ra=Number(r.headers.get('retry-after')||0);
        if(r.status===401)throw new ProviderError('AUTHENTICATION','Authentication failed',401);
        if(r.status===403)throw new ProviderError('PERMISSION','Permission denied',403);
        if(r.status===400||r.status===404||r.status===422)throw new ProviderError('VALIDATION','Provider rejected request',r.status);
        if(r.status===429){if(i+1<attempts){await new Promise(x=>setTimeout(x,Math.min((ra||2**i)*1000,10000)));continue}throw new ProviderError('RATE_LIMIT','Rate limited',429,ra)}
        if(r.status>=500&&i+1<attempts){await new Promise(x=>setTimeout(x,Math.min(500*2**i,3000)));continue}
        throw new ProviderError('PROVIDER_ERROR',`Provider error ${r.status}`,r.status);
      }catch(e){if(e instanceof ProviderError)throw e;if((e as Error).name==='AbortError')throw new ProviderError('TIMEOUT','Provider request timed out');if(i+1===attempts)throw new ProviderError('NETWORK','Provider network failure');await new Promise(x=>setTimeout(x,500*2**i));}finally{clearTimeout(timer)}
    }
  }
}
