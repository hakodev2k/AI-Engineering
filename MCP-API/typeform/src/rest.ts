import type { Config } from './config.js';
export class TypeformApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterMs?: number) { super(message); }
}
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export class TypeformRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}
  async request<T>(method: string, path: string, opts: { query?: Record<string,string|number|boolean|undefined>; body?: unknown; retry?: boolean } = {}): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [k,v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const safeRetry = opts.retry ?? method === 'GET';
    for (let attempt = 0;; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: ctrl.signal,
          headers: { Authorization: `Bearer ${this.config.apiToken}`, Accept: 'application/json', ...(opts.body ? {'Content-Type':'application/json'} : {}) },
          body: opts.body ? JSON.stringify(opts.body) : undefined
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : undefined;
        if (res.ok) return data as T;
        const retryAfter = res.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        if ((res.status === 429 || res.status >= 500) && safeRetry && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 250 * (2 ** attempt), 10000));
          continue;
        }
        const message = data?.description ?? data?.message ?? `Typeform API ${res.status}`;
        throw new TypeformApiError(res.status, String(message), retryAfterMs);
      } catch (error) {
        if (error instanceof TypeformApiError) throw error;
        if (attempt < this.config.maxRetries && safeRetry) { await sleep(250 * (2 ** attempt)); continue; }
        if ((error as Error).name === 'AbortError') throw new Error('Typeform API request timed out');
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
