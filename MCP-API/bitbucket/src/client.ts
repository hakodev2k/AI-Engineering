import { BitbucketConfig } from './config.js';

export class BitbucketError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class BitbucketClient {
  constructor(private readonly config: BitbucketConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeader() {
    if (this.config.authMode === 'oauth') return `Bearer ${this.config.accessToken}`;
    return `Basic ${Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString('base64')}`;
  }

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.authHeader(),
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        if ((res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new BitbucketError(res.status, `Bitbucket API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (err) {
        if (err instanceof BitbucketError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Bitbucket API timeout after ${this.config.timeoutMs}ms`);
        if (attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, body); }
}
