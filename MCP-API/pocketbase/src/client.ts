import { setTimeout as delay } from 'node:timers/promises';
import type { ConnectorConfig } from './config.js';

export class PocketBaseApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly providerMessage: string,
    public readonly data: unknown,
    public readonly retryAfterSeconds?: number
  ) {
    super(`PocketBase API ${status}: ${providerMessage}`);
  }
}

export class PocketBaseClient {
  constructor(private readonly cfg: ConnectorConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; auth?: boolean } = {}): Promise<unknown> {
    if (!path.startsWith('/api/')) throw new Error('Only PocketBase /api/ paths are allowed');
    const url = new URL(path, `${this.cfg.baseUrl}/`);
    for (const [key, value] of Object.entries(options.query || {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const auth = options.auth !== false;
    if (auth && !this.cfg.authToken) throw new Error('POCKETBASE_AUTH_TOKEN is required for this tool');

    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const headers: Record<string, string> = { 'accept': 'application/json', 'user-agent': 'ai-engineering-pocketbase-connector/1.0' };
        if (auth && this.cfg.authToken) headers.authorization = this.cfg.authToken;
        if (options.body !== undefined) headers['content-type'] = 'application/json';

        const response = await this.fetchImpl(url, {
          method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });

        const text = await response.text();
        let data: unknown = null;
        if (text) {
          try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 4096) }; }
        }
        if (response.ok) return data;

        const retryAfter = Number(response.headers.get('retry-after') || '0') || undefined;
        const message = typeof data === 'object' && data && 'message' in data ? String((data as any).message) : response.statusText;
        if ((response.status === 429 || response.status >= 500) && attempt < 2) {
          const waitMs = retryAfter ? Math.min(retryAfter * 1000, 10000) : 250 * (2 ** attempt);
          await delay(waitMs);
          continue;
        }
        throw new PocketBaseApiError(response.status, message, data, retryAfter);
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('PocketBase request failed after bounded retries');
  }
}
