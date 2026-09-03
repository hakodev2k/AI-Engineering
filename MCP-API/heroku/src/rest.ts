import type { Config } from './config.js';

export class HerokuApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly requestId?: string,
    public readonly retryAfterMs?: number
  ) { super(message); }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class HerokuRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: {
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    retry?: boolean;
  } = {}): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const retryable = options.retry ?? method === 'GET';
    for (let attempt = 0;; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: 'application/vnd.heroku+json; version=3',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {})
          },
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined
        });
        const text = await response.text();
        let data: any = undefined;
        if (text) {
          try { data = JSON.parse(text); } catch { data = text; }
        }
        if (response.ok) return data as T;
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter && Number.isFinite(Number(retryAfter)) ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        if ((response.status === 429 || response.status >= 500) && retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 250 * 2 ** attempt, 10000));
          continue;
        }
        const message = typeof data?.message === 'string' ? data.message : `Heroku API ${response.status}`;
        throw new HerokuApiError(response.status, message, response.headers.get('request-id') ?? undefined, retryAfterMs);
      } catch (error) {
        if (error instanceof HerokuApiError) throw error;
        if (retryable && attempt < this.config.maxRetries) {
          await sleep(250 * 2 ** attempt);
          continue;
        }
        if ((error as Error).name === 'AbortError') throw new Error('Heroku API request timed out');
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
