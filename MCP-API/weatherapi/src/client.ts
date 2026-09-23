import {ConnectorError,config,sleep} from './core.js';
export class WeatherApiClient {
 private c=config();
 async get(path:string,params:Record<string,string|number|boolean|undefined>,signal?:AbortSignal){
  const allowed=new Set(['current.json','forecast.json','search.json','history.json','alerts.json','marine.json','future.json','timezone.json','astronomy.json','ip.json']);
  if(!allowed.has(path)) throw new ConnectorError('VALIDATION','Endpoint is not allowlisted');
  const u=new URL(`${this.c.base}/${path}`); u.searchParams.set('key',this.c.key);
  for(const [k,v] of Object.entries(params)) if(v!==undefined) u.searchParams.set(k,String(v));
  for(let attempt=0;;attempt++){
   const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.c.timeout); const abort=()=>ctrl.abort(); signal?.addEventListener('abort',abort,{once:true});
   try { const r=await fetch(u,{signal:ctrl.signal,headers:{accept:'application/json'}}); const body=await r.json().catch(()=>({}));
    if(r.ok) return body;
    const msg=(body as any)?.error?.message ?? `WeatherAPI HTTP ${r.status}`;
    if(r.status===401||r.status===403) throw new ConnectorError('AUTH',msg,r.status);
    if(r.status===400) throw new ConnectorError('VALIDATION',msg,r.status);
    const ra=Number(r.headers.get('retry-after')??0);
    if((r.status===429||r.status>=500)&&attempt<this.c.retries){await sleep(ra?ra*1000:250*2**attempt);continue;}
    throw new ConnectorError(r.status===429?'RATE_LIMIT':'PROVIDER',msg,r.status,ra||undefined);
   } catch(e:any){ if(e instanceof ConnectorError) throw e; if(e?.name==='AbortError') throw new ConnectorError('TIMEOUT','WeatherAPI request timed out'); if(attempt<this.c.retries){await sleep(250*2**attempt);continue;} throw new ConnectorError('NETWORK',e?.message??'Network failure'); }
   finally {clearTimeout(timer);signal?.removeEventListener('abort',abort);}
  }
 }
}
