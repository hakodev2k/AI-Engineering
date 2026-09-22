export class PlunkError extends Error{constructor(message,status,code,retryAfter){super(message);this.name='PlunkError';this.status=status;this.code=code;this.retryAfter=retryAfter}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export class PlunkClient{
 constructor(config,fetchImpl=fetch){this.c=config;this.fetch=fetchImpl}
 async request(path,{method='GET',body,signal,idempotencyKey}={}){
  const url=new URL(path,this.c.baseUrl+'/'); if(url.origin!==new URL(this.c.baseUrl).origin)throw new Error('Cross-origin requests are forbidden');
  for(let attempt=0;;attempt++){
   const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),this.c.timeoutMs); const onAbort=()=>ctl.abort(); signal?.addEventListener('abort',onAbort,{once:true});
   try{
    const headers={Authorization:`Bearer ${this.c.apiKey}`,Accept:'application/json'}; if(body!==undefined)headers['Content-Type']='application/json'; if(idempotencyKey)headers['Idempotency-Key']=idempotencyKey;
    const res=await this.fetch(url,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:ctl.signal});
    const text=await res.text(); let data=null; try{data=text?JSON.parse(text):null}catch{data={message:text}}
    if(res.ok)return data;
    const retryAfter=res.headers?.get?.('retry-after'); const retryable=(res.status===429||res.status>=500)&&method==='GET'&&attempt<this.c.maxRetries;
    if(retryable){const wait=retryAfter?Math.min(Number(retryAfter)*1000,10000):Math.min(250*2**attempt,2000);await sleep(wait);continue}
    throw new PlunkError(data?.message||`Plunk API error ${res.status}`,res.status,data?.code,retryAfter||undefined);
   }catch(e){if(e.name==='AbortError')throw new PlunkError('Plunk request timed out',408,'timeout');throw e}finally{clearTimeout(timer);signal?.removeEventListener('abort',onAbort)}
  }
 }
}
