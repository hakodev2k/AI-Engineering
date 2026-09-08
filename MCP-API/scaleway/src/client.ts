import { config, assertConfigured } from './config.js';

export class ScalewayError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterSeconds?: number,
    public readonly body?: unknown
  ) { super(message); }
}

type FetchLike = typeof fetch;

export class ScalewayClient {
  private readonly baseUrl = 'https://api.scaleway.com';
  constructor(private readonly fetchImpl: FetchLike = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, retryable = method === 'GET'): Promise<T> {
    assertConfigured();
    if (!path.startsWith('/')) throw new Error('Scaleway API path must be absolute');
    const attempts = retryable ? config.maxRetries + 1 : 1;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        const response = await this.fetchImpl(this.baseUrl + path, {
          method,
          headers: {
            'X-Auth-Token': config.secretKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });

        const text = await response.text();
        const parsed = text ? safeJson(text) : undefined;
        if (response.ok) return parsed as T;

        const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
        const error = new ScalewayError(
          `Scaleway API ${method} ${path} failed with HTTP ${response.status}`,
          response.status,
          retryAfter,
          parsed
        );

        const canRetry = retryable && attempt + 1 < attempts && (response.status === 429 || response.status >= 500);
        if (!canRetry) throw error;
        await sleep(retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt);
      } catch (error) {
        if (error instanceof ScalewayError) throw error;
        if (attempt + 1 >= attempts) throw error;
        await sleep(250 * 2 ** attempt);
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('Unreachable retry state');
  }

  async listAll<T>(path: string, collectionKey: string, pageSize = 50, maxPages = config.maxPages): Promise<{ items: T[]; pages: number; totalCount?: number }> {
    const items: T[] = [];
    let totalCount: number | undefined;
    let pages = 0;
    for (let page = 1; page <= maxPages; page++) {
      const separator = path.includes('?') ? '&' : '?';
      const data = await this.request<Record<string, unknown>>('GET', `${path}${separator}page=${page}&page_size=${pageSize}`);
      const batch = Array.isArray(data[collectionKey]) ? data[collectionKey] as T[] : [];
      items.push(...batch);
      pages = page;
      if (typeof data.total_count === 'number') totalCount = data.total_count;
      else if (typeof data.total_count === 'string') totalCount = Number(data.total_count);
      if (batch.length < pageSize || (totalCount !== undefined && items.length >= totalCount)) break;
    }
    return { items, pages, totalCount };
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
