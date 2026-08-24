import { RedditAuth } from './auth.js';
import { RedditConfig } from './config.js';

export class RedditApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class RedditClient {
  constructor(
    private readonly config: RedditConfig,
    private readonly auth = new RedditAuth(config),
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  private async request<T>(method: 'GET' | 'POST', path: string, query?: Record<string, string | number | boolean | undefined>, form?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    url.searchParams.set('raw_json', '1');
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    let refreshed = false;
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const token = await this.auth.getAccessToken(refreshed);
        const body = form ? new URLSearchParams(Object.fromEntries(Object.entries(form).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)]))) : undefined;
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': this.config.userAgent,
            Accept: 'application/json',
            ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
          },
          body
        });
        if (res.status === 401 && !refreshed && this.config.refreshToken) { refreshed = true; continue; }
        const retryAfter = Number(res.headers.get('retry-after') ?? res.headers.get('x-ratelimit-reset') ?? 0);
        if ((res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? Math.min(retryAfter * 1000, 30000) : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new RedditApiError(res.status, `Reddit API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        const text = await res.text();
        return (text ? JSON.parse(text) : undefined) as T;
      } catch (err) {
        if (err instanceof RedditApiError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Reddit API timeout after ${this.config.timeoutMs}ms`);
        if (attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('GET', path, query); }
  post<T>(path: string, form?: Record<string, string | number | boolean | undefined>) { return this.request<T>('POST', path, undefined, form); }
}
