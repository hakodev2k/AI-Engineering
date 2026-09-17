export class LinearError extends Error { constructor(message:string, public code='LINEAR_ERROR', public retryAfterMs?:number){super(message)} }
export class LinearClient {
  constructor(private token=process.env.LINEAR_API_KEY||'', private timeout=Number(process.env.LINEAR_TIMEOUT_MS||15000)) { if(!token) throw new LinearError('LINEAR_API_KEY is required','AUTH_REQUIRED'); }
  async query<T>(query:string, variables:Record<string,unknown>={}):Promise<T>{
    const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),this.timeout);
    try { const r=await fetch('https://api.linear.app/graphql',{method:'POST',headers:{'content-type':'application/json','authorization':this.token},body:JSON.stringify({query,variables}),signal:ctl.signal});
      const body:any=await r.json().catch(()=>({})); const rate=body?.errors?.find((e:any)=>e?.extensions?.code==='RATELIMITED');
      if(rate) throw new LinearError(rate.message,'RATE_LIMITED',Number(r.headers.get('retry-after')||0)*1000||undefined);
      if(r.status===401||r.status===403) throw new LinearError('Authentication or scope rejected','AUTH_FAILED');
      if(!r.ok||body.errors?.length) throw new LinearError(body.errors?.map((e:any)=>e.message).join('; ')||`HTTP ${r.status}`,'API_ERROR');
      return body.data as T;
    } catch(e:any){ if(e?.name==='AbortError') throw new LinearError('Linear request timed out','TIMEOUT'); throw e; } finally {clearTimeout(timer)}
  }
}
