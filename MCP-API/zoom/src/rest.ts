import type { Config } from './config.js';

export class ZoomError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public code?: number | string) { super(message); }
}

export class ZoomRestClient {
  constructor(private readonly config: Config, private readonly fetchFn: typeof fetch = fetch) {}

  async get(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request('GET', path, undefined, query); }
  async post(path: string, body: unknown) { return this.request('POST', path, body); }
  async patch(path: string, body: unknown) { return this.request('PATCH', path, body); }
  async del(path: string, query?: Record<string,string|number|boolean|undefined>) { return this.request('DELETE', path, undefined, query); }

  private async request(method: string, path: string, body?: unknown, query?: Record<string,string|number|boolean|undefined>) {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [k,v] of Object.entries(query || {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const retryable = method === 'GET';
    let last: unknown;
    for (let attempt = 0; attempt <= (retryable ? this.config.maxRetries : 0); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchFn(url, {
          method,
          signal: controller.signal,
          headers: { Authorization: `Bearer ${this.config.accessToken}`, Accept: 'application/json', ...(body === undefined ? {} : {'Content-Type':'application/json'}) },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        if (res.ok) {
          if (res.status === 204) return { ok: true, status: 204 };
          const text = await res.text();
          return text ? JSON.parse(text) : { ok: true, status: res.status };
        }
        const retryAfter = Number(res.headers.get('retry-after') || 0) || undefined;
        let payload: any = {};
        try { payload = await res.json(); } catch {}
        const err = new ZoomError(res.status, payload.message || `Zoom API HTTP ${res.status}`, retryAfter, payload.code);
        if (!retryable || ![429,500,502,503,504].includes(res.status) || attempt === this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, retryAfter ? retryAfter * 1000 : Math.min(250 * 2 ** attempt, 4000)));
      } catch (e) {
        last = e;
        if (e instanceof ZoomError) throw e;
        if (!retryable || attempt === this.config.maxRetries) throw e;
        await new Promise(r => setTimeout(r, Math.min(250 * 2 ** attempt, 4000)));
      } finally { clearTimeout(timer); }
    }
    throw last instanceof Error ? last : new Error('Zoom request failed');
  }
}
