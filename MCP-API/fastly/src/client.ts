import type { Config } from './config.js';

export class FastlyError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class FastlyClient {
  constructor(private cfg: Config, private fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, extraHeaders: Record<string,string> = {}): Promise<T> {
    const safePath = path.startsWith('/') ? path : `/${path}`;
    let last: unknown;
    for (let attempt=0; attempt<=this.cfg.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const res = await this.fetchImpl(`${this.cfg.apiBaseUrl}${safePath}`, {
          method,
          headers: { 'Fastly-Key': this.cfg.token, 'Accept':'application/json', ...(body ? {'Content-Type':'application/json'} : {}), ...extraHeaders },
          body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal
        });
        if (res.ok) {
          if (res.status === 204) return undefined as T;
          const text = await res.text(); return (text ? JSON.parse(text) : undefined) as T;
        }
        const text = await res.text();
        const retryAfter = Number(res.headers.get('retry-after') || 0) || undefined;
        const retryable = res.status === 429 || res.status >= 500;
        const err = new FastlyError(res.status, `Fastly API ${res.status}: ${text.slice(0,500)}`, retryAfter);
        if (!retryable || attempt === this.cfg.maxRetries || method === 'DELETE') throw err;
        last = err;
        const delay = retryAfter ? retryAfter*1000 : Math.min(4000, 250*(2**attempt));
        await new Promise(r => setTimeout(r, delay));
      } catch (e) {
        if (e instanceof FastlyError) throw e;
        last = e;
        if (attempt === this.cfg.maxRetries || method !== 'GET') throw e;
        await new Promise(r => setTimeout(r, Math.min(4000, 250*(2**attempt))));
      } finally { clearTimeout(timer); }
    }
    throw last instanceof Error ? last : new Error('Fastly request failed');
  }
}
