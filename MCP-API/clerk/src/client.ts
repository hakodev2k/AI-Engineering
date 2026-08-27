import type { Config } from './config.js';

export class ClerkApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public body?: unknown) { super(message); }
}

export class ClerkClient {
  constructor(private config: Config, private fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string,string|number|boolean|undefined>, signal?: AbortSignal): Promise<T> {
    const url = new URL(this.config.baseUrl + path);
    for (const [k,v] of Object.entries(query || {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const maxAttempts = method === 'GET' ? 3 : 1;
    let last: unknown;
    for (let attempt=0; attempt<maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('timeout')), this.config.timeoutMs);
      const onAbort = () => controller.abort(signal?.reason);
      signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: { Authorization: `Bearer ${this.config.secretKey}`, Accept: 'application/json', ...(body !== undefined ? {'Content-Type':'application/json'} : {}) },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await res.text();
        const parsed = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        if (res.ok) return parsed as T;
        const retryAfter = Number(res.headers.get('retry-after') || '') || undefined;
        const err = new ClerkApiError(res.status, `Clerk API ${res.status} ${method} ${path}`, retryAfter, parsed);
        if (method === 'GET' && (res.status === 429 || res.status >= 500) && attempt + 1 < maxAttempts) {
          const delay = Math.min((retryAfter ?? 2 ** attempt) * 1000, 10000);
          await new Promise(r => setTimeout(r, delay));
          last = err; continue;
        }
        throw err;
      } catch (e) {
        last = e;
        if (method !== 'GET' || attempt + 1 >= maxAttempts || e instanceof ClerkApiError) throw e;
        await new Promise(r => setTimeout(r, Math.min(500 * 2 ** attempt, 2000)));
      } finally {
        clearTimeout(timer); signal?.removeEventListener('abort', onAbort);
      }
    }
    throw last instanceof Error ? last : new Error('Clerk request failed');
  }
}
