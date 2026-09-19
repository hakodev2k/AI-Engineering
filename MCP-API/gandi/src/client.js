const retryable=new Set([429,500,502,503,504]);
export class GandiError extends Error{constructor(message,status,body,retryAfter){super(message);this.status=status;this.body=body;this.retryAfter=retryAfter}}
export class GandiClient{
 constructor(config,fetchImpl=fetch){this.c=config;this.fetch=fetchImpl}
 async request(method,path,{query,body,retry=true}={}){
  const url=new URL(this.c.base+path); for(const [k,v] of Object.entries(query||{}))if(v!==undefined&&v!==null&&v!=='')url.searchParams.set(k,String(v));
  for(let attempt=0;attempt<3;attempt++){
   const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),this.c.timeoutMs);
   try{
    const r=await this.fetch(url,{method,headers:{Authorization:`Bearer ${this.c.token}`,Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:ctl.signal});
    const text=await r.text(); let data; try{data=text?JSON.parse(text):null}catch{data=text}
    if(r.ok)return {data,status:r.status,location:r.headers.get('location')};
    const ra=r.headers.get('retry-after'); if(retry&&['GET','HEAD'].includes(method)&&retryable.has(r.status)&&attempt<2){await new Promise(x=>setTimeout(x,ra?Math.min(Number(ra)*1000,10000):250*2**attempt));continue}
    throw new GandiError(`Gandi API ${r.status}`,r.status,data,ra);
   }catch(e){if(e.name==='AbortError')throw new Error(`Gandi API timeout after ${this.c.timeoutMs}ms`);throw e}finally{clearTimeout(timer)}
  }
 }
}
