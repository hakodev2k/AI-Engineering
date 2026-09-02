import type { Config } from './config.js';

type QueryValue = string | number | boolean | string[] | undefined;

export class WorkOSApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterMs?: number) { super(message); }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class WorkOSClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, QueryValue>; body?: unknown; retry?: boolean } = {}): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value === undefined) continue;
      if (Array.isArray(value)) value.forEach(item => url.searchParams.append(key, item));
      else url.searchParams.set(key, String(value));
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
            Accept: 'application/json',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {})
          },
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined
        });
        const raw = await response.text();
        let data: any = undefined;
        if (raw) { try { data = JSON.parse(raw); } catch { data = raw; } }
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter == null ? undefined : Math.max(0, Number(retryAfter) * 1000);
        if (response.ok) return data as T;
        if ((response.status === 429 || response.status >= 500) && retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? (250 * 2 ** attempt + Math.floor(Math.random() * 100)), 10000));
          continue;
        }
        const message = typeof data?.message === 'string' ? data.message : typeof data?.error === 'string' ? data.error : `WorkOS API ${response.status}`;
        throw new WorkOSApiError(response.status, message, retryAfterMs);
      } catch (error) {
        if (error instanceof WorkOSApiError) throw error;
        if ((error as Error).name === 'AbortError') throw new Error('WorkOS API request timed out');
        if (retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(250 * 2 ** attempt + Math.floor(Math.random() * 100), 10000));
          continue;
        }
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
