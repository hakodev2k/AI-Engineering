export type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

export class LogSnagError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export interface ClientConfig { token: string; baseUrl?: string; timeoutMs?: number; maxRetries?: number; fetchImpl?: typeof fetch; }

export class LogSnagClient {
  private readonly baseUrl: string; private readonly timeoutMs: number; private readonly maxRetries: number; private readonly f: typeof fetch;
  constructor(private readonly cfg: ClientConfig) {
    if (!cfg.token?.trim()) throw new Error('LOGSNAG_API_TOKEN is required');
    this.baseUrl = (cfg.baseUrl ?? 'https://api.logsnag.com').replace(/\/$/, '');
    if (!this.baseUrl.startsWith('https://')) throw new Error('LogSnag base URL must use HTTPS');
    this.timeoutMs = cfg.timeoutMs ?? 10000; this.maxRetries = cfg.maxRetries ?? 2; this.f = cfg.fetchImpl ?? fetch;
  }
  async post(path: string, body: Record<string, unknown>, method: 'POST'|'PATCH'='POST'): Promise<Json> {
    for (let attempt=0;;attempt++) {
      const ctrl = new AbortController(); const timer = setTimeout(()=>ctrl.abort(), this.timeoutMs);
      try {
        const r = await this.f(`${this.baseUrl}${path}`, {method, headers:{Authorization:`Bearer ${this.cfg.token}`,'Content-Type':'application/json'}, body:JSON.stringify(body), signal:ctrl.signal});
        const retryAfter = Number(r.headers.get('retry-after') ?? '0') || undefined;
        if (r.ok) { const text=await r.text(); return text ? JSON.parse(text) as Json : {ok:true}; }
        const text=(await r.text()).slice(0,2000); const retryable=r.status===429 || r.status>=500;
        if (retryable && attempt<this.maxRetries) { await new Promise(x=>setTimeout(x, retryAfter ? retryAfter*1000 : 250*(2**attempt))); continue; }
        throw new LogSnagError(r.status, `LogSnag API ${r.status}: ${text || r.statusText}`, retryAfter);
      } catch (e) {
        if (e instanceof LogSnagError) throw e;
        if (attempt<this.maxRetries && !(e instanceof DOMException && e.name==='AbortError')) { await new Promise(x=>setTimeout(x,250*(2**attempt))); continue; }
        throw new Error(e instanceof DOMException && e.name==='AbortError' ? 'LogSnag request timed out' : `LogSnag network error: ${String(e)}`);
      } finally { clearTimeout(timer); }
    }
  }
}
