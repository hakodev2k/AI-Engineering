import type { Config } from './config.js';
export class GitBookApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterMs?: number) { super(message); }
}
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export class GitBookRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}
  async request<T>(method: string, path: string, opts: { query?: Record<string, string|number|boolean|undefined>; body?: unknown; retry?: boolean } = {}): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [k,v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const safeRetry = opts.retry ?? method === 'GET';
    for (let attempt = 0;; attempt++) {
      const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, { method, signal: ctrl.signal,
          headers: { Authorization: `Bearer ${this.config.token}`, Accept: 'application/json', ...(opts.body ? {'Content-Type':'application/json'} : {}) },
          body: opts.body ? JSON.stringify(opts.body) : undefined });
        const text = await res.text(); const data = text ? JSON.parse(text) : undefined;
        if (res.ok) return data as T;
        const ra = res.headers.get('retry-after'); const reset = res.headers.get('x-ratelimit-reset');
        const retryAfterMs = ra ? Math.max(0, Number(ra) * 1000) : reset ? Math.max(0, Number(reset) * 1000 - Date.now()) : undefined;
        if ((res.status === 429 || res.status >= 500) && safeRetry && attempt < this.config.maxRetries) { await sleep(Math.min(retryAfterMs ?? 250 * 2 ** attempt, 10000)); continue; }
        const msg = typeof data?.message === 'string' ? data.message : `GitBook API ${res.status}`;
        throw new GitBookApiError(res.status, msg, retryAfterMs);
      } catch (e) {
        if (e instanceof GitBookApiError) throw e;
        if (attempt < this.config.maxRetries && safeRetry) { await sleep(250 * 2 ** attempt); continue; }
        if ((e as Error).name === 'AbortError') throw new Error('GitBook API request timed out');
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
  async paginate<T>(path: string, query: Record<string,string|number|boolean|undefined> = {}, maxPages = 10): Promise<T[]> {
    const out: T[] = []; let page: string | undefined;
    for (let i=0; i<maxPages; i++) {
      const r: any = await this.request('GET', path, { query: {...query, page} });
      const items = r.items ?? r.data ?? []; if (!Array.isArray(items)) return out;
      out.push(...items); page = r.next?.page ?? r.nextPage ?? undefined; if (!page) break;
    }
    return out;
  }
}
