import { QuickBooksTokenProvider } from './auth.js';
import { apiBaseUrl, QuickBooksConfig } from './config.js';

export class QuickBooksApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class QuickBooksClient {
  constructor(
    private readonly config: QuickBooksConfig,
    private readonly tokens: QuickBooksTokenProvider,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  private async send<T>(method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${apiBaseUrl(this.config)}/${this.config.realmId}${path}`);
    url.searchParams.set('minorversion', this.config.minorVersion);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const retryableMethod = method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const token = await this.tokens.getAccessToken();
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        if (res.status === 401) this.tokens.invalidate();
        if (retryableMethod && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, waitMs));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new QuickBooksApiError(res.status, `QuickBooks API ${res.status}: ${text.slice(0, 3000)}`, retryAfter || undefined);
        }
        return await res.json() as T;
      } catch (error) {
        if (error instanceof QuickBooksApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`QuickBooks API timeout after ${this.config.timeoutMs}ms`);
        if (!retryableMethod || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) { return this.send<T>('GET', path, undefined, query); }
  post<T>(path: string, body: unknown) { return this.send<T>('POST', path, body); }

  query<T>(statement: string) { return this.get<T>('/query', { query: statement }); }
  report<T>(name: string, params?: Record<string, string | number | undefined>) { return this.get<T>(`/reports/${encodeURIComponent(name)}`, params); }
}
