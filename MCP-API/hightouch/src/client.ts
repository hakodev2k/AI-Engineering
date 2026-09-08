import { config } from './config.js';
import { getApiKey } from './auth.js';

export class HightouchError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = 'HightouchError';
  }
}

type FetchLike = typeof fetch;
type RequestOptions = { query?: Record<string, string | number | undefined>; retrySafe?: boolean };

export class HightouchClient {
  private lastRequestAt = 0;

  constructor(
    private readonly baseUrl = config.apiBaseUrl,
    private readonly fetchImpl: FetchLike = fetch,
    private readonly timeoutMs = config.timeoutMs,
    private readonly maxRetries = config.maxRetries,
  ) {
    const url = new URL(baseUrl);
    if (url.protocol !== 'https:') throw new Error('HIGHTOUCH_API_BASE_URL must use https');
  }

  private async pace(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt;
    const wait = Math.max(0, 50 - elapsed);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    this.lastRequestAt = Date.now();
  }

  private static retryAfterMs(headers: Headers): number | undefined {
    const value = headers.get('retry-after');
    if (!value) return undefined;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(value);
    return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
  }

  async request<T>(method: 'GET' | 'POST', path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith('/')) throw new Error('API path must be absolute');
    const url = new URL(this.baseUrl.replace(/\/$/, '') + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const retrySafe = options.retrySafe ?? method === 'GET';
    let attempt = 0;
    while (true) {
      await this.pace();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: { Authorization: `Bearer ${getApiKey()}`, Accept: 'application/json' },
        });
        const retryAfterMs = HightouchClient.retryAfterMs(response.headers);
        const text = await response.text();
        let parsed: unknown = undefined;
        if (text) {
          try { parsed = JSON.parse(text); } catch { parsed = text; }
        }
        if (response.ok) return parsed as T;

        const retryable = retrySafe && (response.status === 429 || response.status >= 500);
        if (retryable && attempt < this.maxRetries) {
          const delay = retryAfterMs ?? Math.min(2000, 250 * 2 ** attempt);
          attempt += 1;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw new HightouchError(`Hightouch API request failed with status ${response.status}`, response.status, retryAfterMs);
      } catch (error) {
        if (error instanceof HightouchError) throw error;
        const timedOut = error instanceof Error && error.name === 'AbortError';
        if (retrySafe && attempt < this.maxRetries) {
          const delay = Math.min(2000, 250 * 2 ** attempt);
          attempt += 1;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw new HightouchError(timedOut ? 'Hightouch API request timed out' : 'Hightouch API network request failed');
      } finally {
        clearTimeout(timer);
      }
    }
  }

  listSyncs() { return this.request('GET', '/syncs'); }
  getSync(id: string) { return this.request('GET', `/syncs/${encodeURIComponent(id)}`); }
  listSyncRuns(id: string, limit = 20) { return this.request('GET', `/syncs/${encodeURIComponent(id)}/runs`, { query: { limit } }); }
  triggerSync(id: string) { return this.request('POST', `/syncs/${encodeURIComponent(id)}/trigger`, { retrySafe: false }); }
  listModels() { return this.request('GET', '/models'); }
  getModel(id: string) { return this.request('GET', `/models/${encodeURIComponent(id)}`); }
  listSources() { return this.request('GET', '/sources'); }
  getSource(id: string) { return this.request('GET', `/sources/${encodeURIComponent(id)}`); }
  listDestinations() { return this.request('GET', '/destinations'); }
  getDestination(id: string) { return this.request('GET', `/destinations/${encodeURIComponent(id)}`); }
}

export function wrapProviderData(data: unknown) {
  return { data, meta: { transport: 'rest', untrusted: true } };
}
