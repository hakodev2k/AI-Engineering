import type { Config } from './config.js';

export class PingdomError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: number, public details?: unknown) { super(message); }
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface RequestOptions { query?: Record<string, unknown>; body?: Record<string, unknown>; signal?: AbortSignal; }

const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  const timer = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason ?? new Error('Aborted')); }, { once: true });
});

export class PingdomClient {
  constructor(private readonly config: Config, private readonly fetchFn: typeof fetch = fetch) {}

  async request(method: Method, path: string, options: RequestOptions = {}): Promise<unknown> {
    if (!path.startsWith('/') || path.includes('..')) throw new Error('Invalid Pingdom API path');
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    const attempts = method === 'GET' ? this.config.maxReadRetries + 1 : 1;
    let last: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(new Error('Pingdom request timed out')), this.config.timeoutMs);
      const onAbort = () => timeout.abort(options.signal?.reason ?? new Error('Aborted'));
      options.signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const response = await this.fetchFn(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {})
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: timeout.signal
        });
        const text = await response.text();
        let data: unknown = undefined;
        if (text) { try { data = JSON.parse(text); } catch { data = { message: text.slice(0, 2000) }; } }
        if (response.ok) return { source: 'pingdom', untrusted: true, status: response.status, data };
        const retryAfterHeader = response.headers.get('retry-after');
        const retryAfter = retryAfterHeader && /^\d+$/.test(retryAfterHeader) ? Number(retryAfterHeader) : undefined;
        const error = new PingdomError(`Pingdom API returned ${response.status}`, response.status, retryAfter, data);
        if (method === 'GET' && [429, 502, 503, 504].includes(response.status) && attempt < attempts - 1) {
          await sleep(Math.min((retryAfter ?? 2 ** attempt) * 1000, 30000), options.signal);
          continue;
        }
        throw error;
      } catch (error) {
        last = error;
        if (error instanceof PingdomError || options.signal?.aborted || attempt >= attempts - 1 || method !== 'GET') throw error;
        await sleep(Math.min(250 * (2 ** attempt), 2000), options.signal);
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
      }
    }
    throw last;
  }
}
