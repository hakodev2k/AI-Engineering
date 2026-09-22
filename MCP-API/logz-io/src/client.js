export class LogzioError extends Error { constructor(message,status,retryAfter,details){ super(message); this.name='LogzioError'; this.status=status; this.retryAfter=retryAfter; this.details=details; } }
export class LogzioClient {
  constructor(config, fetchImpl=fetch){ this.config=config; this.fetch=fetchImpl; }
  async request(method,path,{query,body,signal}={}){
    if(!path.startsWith('/') || path.includes('..')) throw new Error('Unsafe API path');
    const url=new URL(this.config.baseUrl+path); for(const [k,v] of Object.entries(query||{})) if(v!==undefined) url.searchParams.set(k,String(v));
    const safe=method==='GET'; const attempts=safe?this.config.maxReadRetries+1:1;
    for(let i=0;i<attempts;i++){
      const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(new Error('Logz.io request timeout')),this.config.timeoutMs); const onAbort=()=>ctl.abort(signal.reason); signal?.addEventListener('abort',onAbort,{once:true});
      try{
        const r=await this.fetch(url,{method,headers:{'X-API-TOKEN':this.config.token,'Accept':'application/json','Accept-Encoding':'gzip, deflate',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:ctl.signal});
        const text=await r.text(); let data; try{data=text?JSON.parse(text):null}catch{data=text.slice(0,4000)}
        if(r.ok) return {provider:'Logz.io',untrustedProviderData:true,status:r.status,data};
        const retryAfter=parseRetryAfter(r.headers.get('retry-after')); const err=new LogzioError(`Logz.io API ${r.status}`,r.status,retryAfter,data);
        if(!safe || ![429,502,503,504].includes(r.status) || i===attempts-1) throw err;
        await sleep(Math.min(10000,retryAfter??250*(2**i)));
      } catch(e){ if(e instanceof LogzioError) throw e; if(!safe || i===attempts-1 || signal?.aborted) throw e; await sleep(250*(2**i)); }
      finally{ clearTimeout(timer); signal?.removeEventListener('abort',onAbort); }
    }
  }
}
function parseRetryAfter(v){ if(!v)return undefined; const n=Number(v); if(Number.isFinite(n)) return Math.max(0,n*1000); const d=Date.parse(v); return Number.isNaN(d)?undefined:Math.max(0,d-Date.now()); }
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
