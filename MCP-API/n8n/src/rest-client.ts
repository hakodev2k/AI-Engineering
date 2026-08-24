import { N8nConfig } from './config.js';

export class N8nApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

type Query = Record<string, string | number | boolean | undefined>;

export class N8nRestClient {
  constructor(private readonly config: N8nConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, query?: Query): Promise<T> {
    const url = new URL(`${this.config.baseUrl}/api/v1${path}`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'X-N8N-API-KEY': this.config.apiKey,
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        const retryable = method === 'GET' && (res.status === 429 || res.status >= 500);
        if (retryable && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new N8nApiError(res.status, `n8n API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (err) {
        if (err instanceof N8nApiError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`n8n API timeout after ${this.config.timeoutMs}ms`);
        if (method !== 'GET' || attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Query) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body?: unknown, query?: Query) { return this.request<T>('POST', path, body, query); }
  put<T>(path: string, body?: unknown, query?: Query) { return this.request<T>('PUT', path, body, query); }
  delete<T>(path: string, query?: Query) { return this.request<T>('DELETE', path, undefined, query); }
}
