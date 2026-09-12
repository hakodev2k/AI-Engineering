import type { Config } from './config.js';
import { PortTokenProvider } from './auth.js';

const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));
export class PortRestClient {
  constructor(private readonly cfg: Config, private readonly tokens: PortTokenProvider, private readonly fetchFn: typeof fetch = fetch) {}
  async request(path:string, init:RequestInit = {}, retry = 0): Promise<unknown> {
    const token = await this.tokens.apiToken();
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
    try {
      const r = await this.fetchFn(`${this.cfg.apiUrl}${path}`, { ...init, signal: controller.signal, headers: { authorization:`Bearer ${token}`, accept:'application/json', 'content-type':'application/json', ...(init.headers ?? {}) } });
      if (r.status === 401 && retry === 0) { this.tokens.invalidate(); return this.request(path, init, 1); }
      if ((r.status === 429 || r.status >= 500) && retry < this.cfg.maxRetries && (init.method ?? 'GET') === 'GET') {
        const reset = Number(r.headers.get('x-ratelimit-reset') ?? '0');
        await sleep(Math.min(10_000, reset > 0 ? reset * 1000 : 250 * 2 ** retry));
        return this.request(path, init, retry + 1);
      }
      if (!r.ok) throw new Error(`Port API error ${r.status}: ${(await r.text()).slice(0,500)}`);
      return r.status === 204 ? { ok:true } : await r.json();
    } finally { clearTimeout(timer); }
  }
  get(path:string) { return this.request(path); }
}
