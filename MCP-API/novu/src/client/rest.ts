import { setTimeout as delay } from 'node:timers/promises';
import type { Config } from '../auth/config.js';

export class NovuApiError extends Error {
  constructor(public status: number, public code: string, public retryAfterSeconds?: number) {
    super(`Novu API ${status}: ${code}`);
  }
}

export class NovuRestClient {
  constructor(private cfg: Config, private fetchImpl: typeof fetch = fetch) {}

  async request(method: string, path: string, options: { query?: Record<string, unknown>; body?: unknown; idempotencyKey?: string; retryable?: boolean } = {}): Promise<unknown> {
    const url = new URL(path, `${this.cfg.apiBase}/`);
    for (const [key, value] of Object.entries(options.query || {})) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) for (const item of value) url.searchParams.append(key, String(item));
      else url.searchParams.set(key, String(value));
    }
    const attempts = options.retryable === false ? 1 : this.cfg.maxRetries + 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `ApiKey ${this.cfg.secretKey}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(options.idempotencyKey ? { 'idempotency-key': options.idempotencyKey } : {}),
            'User-Agent': 'ai-engineering-novu-connector/1.0'
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        let data: unknown = {};
        if (text) { try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 4096) }; } }
        if (response.ok) return data;
        const retryAfter = Number(response.headers.get('retry-after') || 0) || undefined;
        const anyData = data as any;
        const code = String(anyData?.error || anyData?.message || anyData?.statusCode || `http_${response.status}`);
        const canRetry = (response.status === 429 || response.status >= 500) && attempt + 1 < attempts;
        if (!canRetry) throw new NovuApiError(response.status, code, retryAfter);
        const waitMs = retryAfter ? Math.min(retryAfter * 1000, 30000) : Math.min(250 * 2 ** attempt, 5000);
        await delay(waitMs);
      } catch (error) {
        if (error instanceof NovuApiError) throw error;
        if (attempt + 1 >= attempts) throw error;
        await delay(Math.min(250 * 2 ** attempt, 5000));
      } finally { clearTimeout(timer); }
    }
    throw new Error('NOVU_REQUEST_EXHAUSTED');
  }
}
