import type { Config } from './config.js';

export class TodoistApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfterMs?: number,
    public readonly body?: unknown
  ) { super(message); }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class TodoistRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(
    method: 'GET' | 'POST',
    path: string,
    opts: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; retry?: boolean } = {}
  ): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(opts.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const safeToRetry = opts.retry ?? method === 'GET';

    for (let attempt = 0;; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: 'application/json',
            ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {})
          },
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
        });

        const raw = await response.text();
        let body: any = undefined;
        if (raw) {
          try { body = JSON.parse(raw); } catch { body = raw; }
        }
        if (response.ok) return body as T;

        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter && Number.isFinite(Number(retryAfter))
          ? Math.max(0, Number(retryAfter) * 1000) : undefined;

        if (safeToRetry && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500)) {
          await sleep(Math.min(retryAfterMs ?? 250 * 2 ** attempt, 10000));
          continue;
        }

        const message = typeof body?.error === 'string'
          ? body.error
          : typeof body?.message === 'string'
            ? body.message
            : `Todoist API request failed with HTTP ${response.status}`;
        throw new TodoistApiError(response.status, message, retryAfterMs, body);
      } catch (error) {
        if (error instanceof TodoistApiError) throw error;
        if (safeToRetry && attempt < this.config.maxRetries) {
          await sleep(250 * 2 ** attempt);
          continue;
        }
        if ((error as Error).name === 'AbortError') throw new Error('Todoist API request timed out');
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  async paginate<T>(
    path: string,
    query: Record<string, string | number | boolean | undefined> = {},
    maxPages = 10
  ): Promise<{ results: T[]; nextCursor?: string }> {
    const results: T[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < maxPages; page++) {
      const response: any = await this.request('GET', path, { query: { ...query, cursor } });
      if (!Array.isArray(response?.results)) throw new Error('Unexpected Todoist pagination response');
      results.push(...response.results);
      cursor = response.next_cursor ?? undefined;
      if (!cursor) return { results };
    }
    return { results, nextCursor: cursor };
  }
}
