import { OpenRouterConfig } from './config.js';

export class OpenRouterError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class OpenRouterClient {
  constructor(private readonly config: OpenRouterConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private headers(token?: string, json = true) {
    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/json',
      ...(json ? { 'Content-Type': 'application/json' } : {}),
      ...(this.config.httpReferer ? { 'HTTP-Referer': this.config.httpReferer } : {}),
      ...(this.config.appTitle ? { 'X-Title': this.config.appTitle } : {})
    };
  }

  async request<T>(method: 'GET'|'POST', path: string, opts: {
    token?: string;
    query?: Record<string, string | number | undefined>;
    body?: unknown;
    retryable?: boolean;
  } = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const retryable = opts.retryable ?? method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: this.headers(opts.token),
          body: opts.body === undefined ? undefined : JSON.stringify(opts.body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        if (retryable && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new OpenRouterError(res.status, `OpenRouter API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        return await res.json() as T;
      } catch (err) {
        if (err instanceof OpenRouterError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`OpenRouter API timeout after ${this.config.timeoutMs}ms`);
        if (!retryable || attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, token?: string, query?: Record<string, string | number | undefined>) {
    return this.request<T>('GET', path, { token, query });
  }

  post<T>(path: string, token: string | undefined, body: unknown, retryable = false) {
    return this.request<T>('POST', path, { token, body, retryable });
  }
}
