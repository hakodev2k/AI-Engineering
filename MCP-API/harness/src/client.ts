import type { HarnessConfig } from './config.js';
import { requireHarnessToken } from './auth.js';

export class HarnessClient {
  constructor(private cfg: HarnessConfig, private fetchFn: typeof fetch = fetch) {}
  async request(path:string, init:RequestInit = {}) {
    const url = new URL(path, this.cfg.HARNESS_BASE_URL);
    const controller = new AbortController(); const timer=setTimeout(()=>controller.abort(), this.cfg.HARNESS_TIMEOUT_MS);
    try {
      for(let attempt=0;;attempt++){
        const r=await this.fetchFn(url,{...init,signal:controller.signal,headers:{'accept':'application/json','content-type':'application/json','x-api-key':requireHarnessToken(),...(init.headers||{})}});
        if(r.ok) return r.status===204?null:r.json();
        const body=await r.text();
        if(![429,502,503,504].includes(r.status)||attempt>=this.cfg.HARNESS_MAX_RETRIES) throw new Error(`Harness ${r.status}: ${body.slice(0,500)}`);
        const retryAfter=Number(r.headers.get('retry-after')||'0');
        await new Promise(res=>setTimeout(res,retryAfter>0?retryAfter*1000:250*Math.pow(2,attempt)));
      }
    } finally { clearTimeout(timer); }
  }
  scope(extra:Record<string,string|number|undefined>={}){ const q=new URLSearchParams({accountIdentifier:this.cfg.HARNESS_ACCOUNT_ID,orgIdentifier:this.cfg.HARNESS_ORG_ID,projectIdentifier:this.cfg.HARNESS_PROJECT_ID}); for(const [k,v] of Object.entries(extra)) if(v!==undefined) q.set(k,String(v)); return q.toString(); }
}
