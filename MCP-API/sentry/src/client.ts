export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class SentryError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
export class SentryClient {
  constructor(private token=process.env.SENTRY_AUTH_TOKEN, private base=(process.env.SENTRY_BASE_URL||'https://sentry.io').replace(/\/$/,''), private timeout=Number(process.env.SENTRY_TIMEOUT_MS||15000)) { if(!token) throw new Error('SENTRY_AUTH_TOKEN is required'); }
  async request(method:string,path:string,body?:unknown,signal?:AbortSignal){
    const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.timeout); const abort=()=>ctrl.abort(); signal?.addEventListener('abort',abort,{once:true});
    try { for(let attempt=0;attempt<3;attempt++){
      const r=await fetch(`${this.base}/api/0${path}`,{method,headers:{Authorization:`Bearer ${this.token}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:ctrl.signal});
      if(r.ok) return r.status===204?null:await r.json();
      const retryAfter=Number(r.headers.get('retry-after')||0); const msg=(await r.text()).slice(0,2000);
      if((r.status===429||r.status>=500)&&method==='GET'&&attempt<2){await new Promise(x=>setTimeout(x,retryAfter?retryAfter*1000:250*2**attempt));continue;}
      throw new SentryError(r.status,msg||`Sentry HTTP ${r.status}`,retryAfter||undefined);
    }} finally {clearTimeout(timer);signal?.removeEventListener('abort',abort)}
  }
}
export function approve(risk:Risk){if(risk==='READ')return;if(process.env.SENTRY_APPROVE_WRITES!=='true')throw new Error(`Human approval required for ${risk} operation (set SENTRY_APPROVE_WRITES=true for this execution)`)}
export const enc=(v:string)=>encodeURIComponent(v);
