import { VercelConfig } from './config.js';

export class VercelApiError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number) { super(message); }
}

export class VercelClient {
  constructor(private readonly config: VercelConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private scopedQuery(query: Record<string, string | number | boolean | undefined> = {}) {
    return { ...query, ...(this.config.teamId ? { teamId: this.config.teamId } : {}), ...(this.config.teamSlug ? { slug: this.config.teamSlug } : {}) };
  }

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [k, v] of Object.entries(this.scopedQuery(query))) if (v !== undefined) url.searchParams.set(k, String(v));
    const retryableMethod = method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: { Authorization: `Bearer ${this.config.accessToken}`, Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0) * 1000;
        if (retryableMethod && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          await new Promise(r => setTimeout(r, retryAfter || Math.min(8000, 250 * 2 ** attempt)));
          continue;
        }
        if (!res.ok) throw new VercelApiError(res.status, `Vercel API ${res.status}: ${(await res.text()).slice(0, 2000)}`, retryAfter || undefined);
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (err) {
        if (err instanceof VercelApiError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Vercel API timeout after ${this.config.timeoutMs}ms`);
        if (!retryableMethod || attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('POST', path, body, query); }
  patch<T>(path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('PATCH', path, body, query); }
  delete<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('DELETE', path, undefined, query); }
}
