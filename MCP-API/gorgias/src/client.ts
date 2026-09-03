import type { GorgiasConfig } from './config.js';

export class GorgiasApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterMs?: number) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class GorgiasClient {
  constructor(private readonly config: GorgiasConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeader(): string {
    if (this.config.auth.type === 'bearer') return `Bearer ${this.config.auth.accessToken}`;
    return `Basic ${Buffer.from(`${this.config.auth.email}:${this.config.auth.apiKey}`).toString('base64')}`;
  }

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
            Authorization: this.authHeader(),
            Accept: 'application/json',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {})
          },
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined
        });

        const raw = await response.text();
        const data = raw ? JSON.parse(raw) : undefined;
        if (response.ok) return data as T;

        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        if ((response.status === 429 || response.status >= 500) && retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 250 * 2 ** attempt, 10000));
          continue;
        }

        const message = typeof data?.detail === 'string'
          ? data.detail
          : typeof data?.message === 'string'
            ? data.message
            : `Gorgias API request failed with status ${response.status}`;
        throw new GorgiasApiError(response.status, message, retryAfterMs);
      } catch (error) {
        if (error instanceof GorgiasApiError) throw error;
        if ((error as Error).name === 'AbortError') throw new Error('Gorgias API request timed out');
        if (retryable && attempt < this.config.maxRetries) {
          await sleep(250 * 2 ** attempt);
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  async paginate<T>(path: string, query: Record<string, string | number | boolean | undefined> = {}, maxPages = 10): Promise<T[]> {
    const items: T[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < maxPages; page++) {
      const response: any = await this.request('GET', path, { query: { ...query, cursor } });
      const batch = response?.data ?? response?.items ?? [];
      if (!Array.isArray(batch)) break;
      items.push(...batch);
      cursor = response?.meta?.next_cursor ?? response?.meta?.next ?? response?.next_cursor ?? undefined;
      if (!cursor) break;
    }
    return items;
  }
}
