import crypto from 'node:crypto';

export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export interface Config { token:string; baseUrl:string; timeoutMs:number; maxRetries:number; allowHighRisk:boolean; allowDestructive:boolean; approvalSecret?:string }

export function loadConfig(env=process.env): Config {
  const token=env.LINODE_API_TOKEN?.trim(); if(!token) throw new Error('LINODE_API_TOKEN is required');
  const baseUrl=(env.LINODE_API_BASE_URL||'https://api.linode.com/v4').replace(/\/$/,'');
  const u=new URL(baseUrl); if(u.protocol!=='https:' || u.hostname!=='api.linode.com' || !u.pathname.startsWith('/v4')) throw new Error('LINODE_API_BASE_URL must be official https://api.linode.com/v4');
  const timeoutMs=Number(env.LINODE_TIMEOUT_MS||15000), maxRetries=Number(env.LINODE_MAX_RETRIES||2);
  if(!Number.isInteger(timeoutMs)||timeoutMs<1000||timeoutMs>120000) throw new Error('Invalid LINODE_TIMEOUT_MS');
  if(!Number.isInteger(maxRetries)||maxRetries<0||maxRetries>5) throw new Error('Invalid LINODE_MAX_RETRIES');
  return {token,baseUrl,timeoutMs,maxRetries,allowHighRisk:env.LINODE_ALLOW_HIGH_RISK==='true',allowDestructive:env.LINODE_ALLOW_DESTRUCTIVE==='true',approvalSecret:env.LINODE_APPROVAL_SECRET};
}
function stable(v:unknown):string { if(Array.isArray(v)) return '['+v.map(stable).join(',')+']'; if(v&&typeof v==='object') return '{'+Object.entries(v as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}'; return JSON.stringify(v); }
export function approval(tool:string,args:Record<string,unknown>,secret:string){ const {approvalToken:_,...payload}=args; return crypto.createHmac('sha256',secret).update(tool+'\n'+stable(payload)).digest('hex'); }
export function enforce(config:Config,risk:Risk,tool:string,args:Record<string,unknown>){ if(risk==='READ') return; if(risk==='HIGH_RISK'&&!config.allowHighRisk) throw new Error('HIGH_RISK_DISABLED'); if(risk==='DESTRUCTIVE'&&!config.allowDestructive) throw new Error('DESTRUCTIVE_DISABLED'); if(!config.approvalSecret) throw new Error('APPROVAL_SECRET_REQUIRED'); const supplied=String(args.approvalToken||''); const expected=approval(tool,args,config.approvalSecret); if(supplied.length!==64||!crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))) throw new Error('APPROVAL_REQUIRED'); }

export class LinodeError extends Error { constructor(public status:number,message:string,public retryAfter?:number,public details?:unknown){super(message)} }
export class LinodeClient {
 constructor(public config:Config, private fetcher:typeof fetch=fetch){}
 async request(method:string,path:string,opts:{query?:Record<string,string|number|undefined>,body?:unknown,retry?:boolean,signal?:AbortSignal}={}){
  const url=new URL(this.config.baseUrl+path); for(const [k,v] of Object.entries(opts.query||{})) if(v!==undefined) url.searchParams.set(k,String(v));
  let last:unknown;
  for(let attempt=0;attempt<=this.config.maxRetries;attempt++){
   const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.config.timeoutMs); const abort=()=>controller.abort(); opts.signal?.addEventListener('abort',abort,{once:true});
   try { const r=await this.fetcher(url,{method,headers:{Authorization:`Bearer ${this.config.token}`,'Content-Type':'application/json'},body:opts.body===undefined?undefined:JSON.stringify(opts.body),signal:controller.signal}); const text=await r.text(); let data:unknown=text; try{data=text?JSON.parse(text):null}catch{}
    if(r.ok) return {data,rateLimit:{limit:r.headers.get('x-ratelimit-limit'),remaining:r.headers.get('x-ratelimit-remaining'),reset:r.headers.get('x-ratelimit-reset')}};
    const ra=Number(r.headers.get('retry-after')||0)||undefined; const e=new LinodeError(r.status,`Linode API ${r.status}`,ra,data); if(!(opts.retry&&attempt<this.config.maxRetries&&(r.status===429||r.status>=500))) throw e; last=e; await new Promise(res=>setTimeout(res,Math.min((ra??2**attempt)*1000,10000)));
   } catch(e){ if(e instanceof LinodeError) throw e; last=e; if(!(opts.retry&&attempt<this.config.maxRetries)) throw new LinodeError(0,'NETWORK_OR_TIMEOUT',undefined,String(e)); await new Promise(res=>setTimeout(res,Math.min(250*2**attempt,2000))); }
   finally { clearTimeout(timer); opts.signal?.removeEventListener('abort',abort); }
  } throw last;
 }
 get(path:string,query?:Record<string,string|number|undefined>){return this.request('GET',path,{query,retry:true})}
 mutate(method:string,path:string,body?:unknown){return this.request(method,path,{body,retry:false})}
}
