import type { Config } from './config.js';

export class ZendeskApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type Options = { method?: 'GET'|'POST'|'PUT'|'DELETE'; body?: unknown; query?: Record<string,string|number|boolean|undefined> };

export class ZendeskClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}
  async request<T>(path: string, options: Options = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(this.config.baseUrl + path);
    for (const [k,v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k,String(v));
    const maxAttempts = method === 'GET' ? 3 : 1;
    let last: unknown;
    for (let attempt=1; attempt<=maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const r = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: { Authorization: `Bearer ${this.config.accessToken}`, Accept: 'application/json', 'Content-Type':'application/json', 'User-Agent':'ai-engineering-zendesk-mcp/1.0' },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await r.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return { raw:text }; } })() : {};
        if (r.ok) return data as T;
        if (r.status === 429 && attempt < maxAttempts) {
          const retryAfter = Number(r.headers.get('retry-after') ?? '1');
          await new Promise(res => setTimeout(res, Math.min(Math.max(retryAfter,0),10)*1000));
          continue;
        }
        throw new ZendeskApiError(r.status, data, `Zendesk API ${method} ${path} failed with HTTP ${r.status}`);
      } catch (e) {
        last = e;
        if (e instanceof ZendeskApiError) throw e;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${e instanceof Error ? e.message : String(e)}`);
        await new Promise(res => setTimeout(res, 250 * 2 ** (attempt-1)));
      } finally { clearTimeout(timer); }
    }
    throw last;
  }
}
