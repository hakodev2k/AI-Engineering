import type { Config } from './config.js';

export class RootlyApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfterMs?: number
  ) {
    super(message);
    this.name = 'RootlyApiError';
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class RootlyRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async get<T>(path: string, query: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: 'application/vnd.api+json'
          }
        });
        const raw = await response.text();
        let data: any;
        try { data = raw ? JSON.parse(raw) : undefined; } catch { data = { error: raw }; }
        if (response.ok) return data as T;

        const retryAfter = response.headers.get('retry-after');
        const reset = response.headers.get('x-ratelimit-reset');
        const retryAfterMs = retryAfter
          ? Math.max(0, Number(retryAfter) * 1000)
          : reset && Number.isFinite(Number(reset))
            ? Math.max(0, Number(reset) * 1000 - Date.now())
            : undefined;
        if ((response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 250 * 2 ** attempt, 10000));
          continue;
        }
        const message = data?.error ?? data?.errors?.[0]?.detail ?? data?.errors?.[0]?.title ?? `Rootly API HTTP ${response.status}`;
        throw new RootlyApiError(response.status, String(message), retryAfterMs);
      } catch (error) {
        if (error instanceof RootlyApiError) throw error;
        if (attempt < this.config.maxRetries) {
          await sleep(250 * 2 ** attempt);
          continue;
        }
        if ((error as Error).name === 'AbortError') throw new Error('Rootly API request timed out');
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
