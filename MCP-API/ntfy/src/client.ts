import type { Config } from './config.js';

export class NtfyError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message);} }
export class NtfyClient {
  constructor(private c:Config, private fetcher:typeof fetch=fetch) {}
  private auth():Record<string,string>{
    if(this.c.NTFY_ACCESS_TOKEN) return {Authorization:`Bearer ${this.c.NTFY_ACCESS_TOKEN}`};
    if(this.c.NTFY_USERNAME && this.c.NTFY_PASSWORD) return {Authorization:`Basic ${Buffer.from(`${this.c.NTFY_USERNAME}:${this.c.NTFY_PASSWORD}`).toString('base64')}`};
    return {};
  }
  private async request(path:string, init:RequestInit={}, retry=true):Promise<Response>{
    for(let attempt=0;;attempt++){
      const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.c.NTFY_TIMEOUT_MS);
      try{
        const r=await this.fetcher(`${this.c.baseUrl}${path}`,{...init,headers:{...this.auth(),...(init.headers||{})},signal:ctrl.signal});
        if(r.ok) return r;
        const ra=Number(r.headers.get('retry-after')||0); const text=(await r.text()).slice(0,1000);
        const retryable=retry && [429,502,503,504].includes(r.status) && attempt<this.c.NTFY_MAX_RETRIES;
        if(!retryable) throw new NtfyError(r.status,text||`ntfy HTTP ${r.status}`,ra||undefined);
        await new Promise(x=>setTimeout(x,Math.min(10000,(ra?ra*1000:250*2**attempt))));
      } finally { clearTimeout(timer); }
    }
  }
  async publish(topic:string, payload:Record<string,unknown>){ return (await (await this.request('/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({topic,...payload})},false)).json()) as unknown; }
  async poll(topic:string, since?:string, limit=20){ const q=new URLSearchParams({poll:'1'}); if(since)q.set('since',since); const text=await (await this.request(`/${encodeURIComponent(topic)}/json?${q}`)).text(); const rows=text.trim().split('\n').filter(Boolean).map(x=>JSON.parse(x)); return rows.filter(x=>x.event==='message').slice(-limit); }
  async health(){ return (await (await this.request('/v1/health')).json()) as unknown; }
}
