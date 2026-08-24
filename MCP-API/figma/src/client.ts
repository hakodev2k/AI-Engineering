import { FigmaConfig } from './config.js';

export class FigmaApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class FigmaClient {
  constructor(private readonly config: FigmaConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private headers(hasBody: boolean) {
    return {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(this.config.authMode === 'oauth'
        ? { Authorization: `Bearer ${this.config.accessToken}` }
        : { 'X-Figma-Token': String(this.config.token) })
    };
  }

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const safeRetry = method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: this.headers(body !== undefined),
          signal: controller.signal,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        if (safeRetry && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new FigmaApiError(res.status, `Figma API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (err) {
        if (err instanceof FigmaApiError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Figma API timeout after ${this.config.timeoutMs}ms`);
        if (!safeRetry || attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
}
