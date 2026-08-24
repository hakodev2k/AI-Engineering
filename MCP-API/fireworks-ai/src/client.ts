import { FireworksConfig } from './config.js';

export class FireworksApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfterSeconds?: number,
    public readonly rateLimit?: Record<string, string>
  ) { super(message); }
}

export class FireworksClient {
  constructor(private readonly config: FireworksConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private headers(body: boolean) {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    };
  }

  private rateLimitHeaders(headers: Headers) {
    const names = [
      'x-ratelimit-limit-tokens-prompt',
      'x-ratelimit-limit-tokens-cache-adjusted-prompt',
      'x-ratelimit-limit-tokens-generated',
      'retry-after'
    ];
    return Object.fromEntries(names.map(name => [name, headers.get(name)]).filter(([, value]) => value !== null) as [string, string][]);
  }

  async request<T>(baseUrl: string, method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${baseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retryableMethod = method === 'GET';

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: this.headers(body !== undefined),
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? 0) || undefined;
        const canRetry = retryableMethod && attempt < this.config.maxRetries && (response.status === 429 || response.status === 503 || response.status >= 500);
        if (canRetry) {
          const delay = retryAfter ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new FireworksApiError(response.status, `Fireworks API ${response.status}: ${text.slice(0, 2000)}`, retryAfter, this.rateLimitHeaders(response.headers));
        }
        if (response.status === 204) return undefined as T;
        return await response.json() as T;
      } catch (error) {
        if (error instanceof FireworksApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Fireworks API timeout after ${this.config.timeoutMs}ms`);
        if (!retryableMethod || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  inferenceGet<T>(path: string, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>(this.config.inferenceBaseUrl, 'GET', path, undefined, query);
  }
  inferencePost<T>(path: string, body: unknown) {
    return this.request<T>(this.config.inferenceBaseUrl, 'POST', path, body);
  }
  platformGet<T>(path: string, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>(this.config.platformBaseUrl, 'GET', path, undefined, query);
  }
  platformPost<T>(path: string, body: unknown, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>(this.config.platformBaseUrl, 'POST', path, body, query);
  }
}
