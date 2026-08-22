import type { ConnectorConfig } from './config.js';

export class GitLabApiError extends Error {
  constructor(public status: number, public body: unknown, public retryAfterMs?: number) {
    super(`GitLab API request failed with HTTP ${status}`);
  }
}

function retryDelay(res: Response, attempt: number): number {
  const retryAfter = res.headers.get('retry-after');
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.min(seconds * 1000, 60_000);
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.min(Math.max(date - Date.now(), 0), 60_000);
  }
  return Math.min(500 * 2 ** attempt + Math.floor(Math.random() * 200), 8000);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class GitLabRestClient {
  constructor(private readonly cfg: ConnectorConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; retryable?: boolean } = {}): Promise<T> {
    const url = new URL(`${this.cfg.apiBaseUrl}${path}`);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.cfg.token}`,
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        if (res.ok) {
          if (res.status === 204) return undefined as T;
          return (await res.json()) as T;
        }

        let body: unknown;
        try { body = await res.json(); } catch { body = await res.text(); }
        const retryable = options.retryable !== false && ['GET', 'HEAD'].includes(method) && (res.status === 429 || res.status >= 500);
        if (retryable && attempt < this.cfg.maxRetries) {
          await sleep(retryDelay(res, attempt));
          continue;
        }
        throw new GitLabApiError(res.status, body, res.status === 429 ? retryDelay(res, attempt) : undefined);
      } catch (error) {
        if (error instanceof GitLabApiError) throw error;
        if (attempt < this.cfg.maxRetries && options.retryable !== false && ['GET', 'HEAD'].includes(method)) {
          await sleep(Math.min(500 * 2 ** attempt, 8000));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  async paged<T>(path: string, query: Record<string, string | number | boolean | undefined> = {}, page = 1, perPage = 20) {
    const items = await this.request<T[]>('GET', path, { query: { ...query, page, per_page: Math.min(Math.max(perPage, 1), 100) } });
    return { items, page, perPage: Math.min(Math.max(perPage, 1), 100), hasMore: items.length === Math.min(Math.max(perPage, 1), 100) };
  }
}
